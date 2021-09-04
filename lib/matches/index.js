import fs from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { Router } from 'express';
import { parse } from 'date-fns';
import { config } from '../config.js';
import { db } from '../services/mongo/index.js';
import * as fit from '../services/fit/index.js';
import * as youtube from '../services/youtube/index.js';
import ws from '../services/ws/index.js';
import {
  APIError, asyncHandler, convertBSONUUIDs, uuidQuery,
} from '../utils/index.js';

// Get cover photo
// TODO: Set dynamically with UI
const thisDir = dirname(fileURLToPath(import.meta.url));
const cover = fs.readFileSync(join(thisDir, './cover.jpg'));

export const router = new Router();

router.get('/', asyncHandler(async (req, res) => {
  const opts = {};
  if (req.query.start && req.query.end) {
    opts.scheduledStartTime = {
      $gte: parse(req.query.start, 'yyyy-MM-dd', new Date()),
    };
    opts.scheduledEndTime = {
      $lte: parse(req.query.end, 'yyyy-MM-dd', new Date()),
    };
  }
  if (req.query.team) {
    Object.assign(opts, {
      $or: [
        { teamA: req.query.team },
        { teamB: req.query.team },
      ],
    });
  }
  if (req.query.comp) {
    Object.assign(opts, { comp: req.query.comp });
  }
  if (req.query.location) {
    Object.assign(opts, {
      location: {
        $in: req.query.location.split(','),
      },
    });
  }
  if (req.query.broadcast === 'live') {
    Object.assign(opts, { broadcastStatus: 'live' });
  }
  if (req.query.broadcast === 'broadcasts') {
    Object.assign(opts, { youtubeId: { $exists: true, $ne: null } });
  }
  if (req.query.slot) {
    const slot = new Date(Number(req.query.slot));
    Object.assign(opts, { scheduledStartTime: slot });
  }
  const matches = convertBSONUUIDs(await db.collection('matches')
    .find(opts).toArray());
  res.json({
    // TODO: Combine
    count: await db.collection('matches').estimatedDocumentCount(),
    length: matches.length,
    items: matches,
  });
}));

router.post('/', asyncHandler(async (req, res) => {
  const matches = await db.collection('matches').find({}).toArray();
  res.json(matches);
}));

// Create broadcast
router.post('/:id/youtube', asyncHandler(async (req, res) => {
  const match = await db.collection('matches')
    .findOne(Object.assign(uuidQuery(req.params.id), { broadcastStatus: 'noBroadcast' }));
  if (match.broadcastStatus !== 'noBroadcast') throw new APIError(400, { broadcastStatus: match.broadcastStatus });
  const opts = {
    title: match.title || youtube.genTitle({
      teamA: match.teamA,
      teamB: match.teamB,
      comp: match.comp,
      round: match.round,
    }),
    description: match.description || youtube.genDescription({
      teamA: match.teamA,
      teamB: match.teamB,
      comp: match.comp,
      round: match.round,
    }),
    scheduledStartTime: match.scheduledStartTime,
    scheduledEndTime: match.scheduledStartTime,
  };
  // Youtube creation
  let youtubeRes;
  try {
    youtubeRes = await youtube.addBroadcast(opts);
  } catch (err) {
    throw new APIError(400, err);
  }
  // Insert back into db
  await db.collection('matches')
    .updateOne(uuidQuery(req.params.id), {
      $set: {
        youtubeId: youtubeRes.data.id,
        broadcastStatus: 'idle',
      },
    });
  ws.broadcastToAll('matches/UPDATE', {
    id: req.params.id,
    youtubeId: youtubeRes.data.id,
    broadcastStatus: 'idle',
  });
  res.sendStatus(201);
  // TODO: Extrapolate into webhooks interface
  if (config.WEBHOOKS) {
    fit.addYoutubeEvent(req.params.id, youtubeRes.data.id)
      .catch(err => console.log('Error pushing to Touch', err));
  }
  // TODO: Repair thumb issue, move to customisable config

  youtube.updateThumbnail(youtubeRes.data.id, cover)
    .catch(err => console.log('Failed to update cover', err));
}));

router.delete('/:id/youtube', asyncHandler(async (req, res) => {
  const match = await db.collection('matches')
    .findOne(Object.assign(uuidQuery(req.params.id)));
  if (!match.youtubeId) throw new APIError(400, 'No Youtube Video associated with match');
  await youtube.removeBroadcast(match.youtubeId);
  await db.collection('matches')
    .updateOne({ _id: match._id }, {
      $set: { broadcastStatus: 'noBroadcast' },
      $unset: { youtubeId: true },
    });
  res.sendStatus(200);
  if (config.WEBHOOKS) {
    fit.deleteYoutubeEvent(req.params.id, match.youtubeId)
      .catch(() => console.log(`Failed to remove youtube/${match.youtubeId} from FIT event ${match._id}`));
  }
  ws.broadcastToAll('matches/UPDATE', {
    id: match._id.value(),
    youtubeId: null,
    broadcastStatus: 'noBroadcast',
    stream: null,
  });
}));

/**
* Bind stream to broadcast
*/
router.post('/:matchId/stream/:streamId', asyncHandler(async (req, res) => {
  const { matchId, streamId } = req.params;
  // Get YoutubeId
  const match = await db.collection('matches')
    .findOne(Object.assign(uuidQuery(matchId)));
  if (!match) res.sendStatus(404, 'Match does not exist');
  if (!match.youtubeId) res.sendStatus(404, 'No YoutubeId associated with match');
  // Confirm stream exists
  const { data } = await youtube.getStream(streamId);
  if (typeof streamId !== 'string' || !streamId.length) throw new APIError(400, { message: 'Stream does not exist' });
  try {
    await youtube.bindStreamToBroadcast(streamId, match.youtubeId);
  } catch (err) {
    // TODO: Detailed error, stream health info
    throw new APIError(500, err);
  }
  ws.broadcastToAll('matches/UPDATE', {
    id: match._id,
    stream: 'binding',
  });
  const update = await db.collection('matches')
    .updateOne({ _id: match._id }, {
      $set: {
        stream: data.items[0].id,
      },
    });
  res.json(update);
  ws.broadcastToAll('matches/UPDATE', {
    id: match._id.value(),
    stream: data.items[0].id,
    bindStatus: null,
  });
}));

// Unbind stream from broadcast
router.delete('/:matchId/stream', asyncHandler(async (req, res) => {
  const { matchId } = req.params;
  // Get YoutubeId
  const match = await db.collection('matches')
    .findOne(Object.assign(uuidQuery(matchId)));
  if (!match) res.sendStatus(404, 'Match does not exist');
  if (!match.youtubeId) res.sendStatus(404, 'No YoutubeId associated with match');
  await youtube.unbindStream(match.youtubeId);
  const update = await db.collection('matches')
    .updateOne({ _id: match._id }, {
      $unset: { stream: true },
    });
  res.json(update);
  ws.broadcastToAll('matches/UPDATE', {
    id: match._id.value(),
    stream: null,
    bindStatus: null,
  });
}));

/**
 * Transition
 * youtubeId
 */
router.put('/:matchId/transition/:broadcastStatus', asyncHandler(async (req, res) => {
  const { matchId, broadcastStatus } = req.params;
  const validBroadcastStatus = ['testing', 'complete', 'live'];
  if (!validBroadcastStatus.includes(broadcastStatus)) {
    throw new APIError(400, `Unexpected broadcast status ${broadcastStatus}, expected one of: ${validBroadcastStatus.join(',')}`);
  }
  // Get YoutubeId
  const match = await db.collection('matches')
    .findOne(Object.assign(uuidQuery(matchId)));
  if (!match) res.sendStatus(404, 'Match does not exist');
  if (!match.youtubeId) res.sendStatus(404, 'No YoutubeId associated with match');
  try {
    await youtube.transition(match.youtubeId, broadcastStatus);
  } catch (err) {
    // Send back reason only
    if (err.response && err.response.data && err.response.data.error) {
      throw new APIError(err.response.status, err.response.data.error.errors[0].reason);
    }
    throw new APIError(500, err);
  }
  // No binding data
  const update = await db.collection('matches')
    .updateOne({ _id: match._id }, {
      $set: {
        broadcastStatus,
      },
    });
  ws.broadcastToAll('matches/UPDATE', {
    id: match._id.value(),
    broadcastStatus,
    transitionStatus: 'ready',
  });
  res.json(update);
}));
