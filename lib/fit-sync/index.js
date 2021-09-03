import { Router } from 'express';
import * as fit from '../services/fit/index.js';
import * as sync from '../services/fit/sync.js';
import { db } from '../services/mongo/index.js';
import { updateTimeslots } from '../time-slots/update.js';
import { updateDivisions } from '../divisions/update.js';
import { asyncHandler } from '../utils/index.js';

export const router = new Router();

router.get('/', asyncHandler(async (req, res) => {
  const [localMatches, fitMatchesRaw] = await Promise.all([
    db.collection('matches').find({}).toArray(), fit.getAllMatches(),
  ]);
  // API Discrepancy: Fit API uses upper case country codes
  const fitMatches = fitMatchesRaw.map(sync.lowerTeamCase).map(sync.convertDates);

  const { patches, removals, additions } = sync.getChanges(localMatches, fitMatches);
  // Handle deletions
  await removals.map((match) =>
    db.collection('matches').deleteOne({
      id: match.id,
    }));
  // Handle additions
  const putMatches = [...additions].map((match) =>
    Object.assign({}, match, {
      broadcastStatus: match.broadcastStatus || 'noBroadcast',
    }));
  if (putMatches.length) await db.collection('matches').insertMany(putMatches);
  // Handle replacements
  // TODO : THIS
  const patchMatches = patches.map((match) => ({
    replaceOne: {
      filter: { id: match._id },
      replacement: { match },
      upsert: false,
    },
  }));
  if (patchMatches.length) await db.collection('matches').bulkWrite(patchMatches);
  // TODO: Consider races
  await Promise.all([updateTimeslots(), updateDivisions()]);
  return res.sendStatus(200);
}));
