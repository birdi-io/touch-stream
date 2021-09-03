import { Router } from 'express';
import ws from '../services/ws/index.js';
import * as youtube from '../services/youtube/index.js';
import {
  APIError, asyncHandler,
} from '../utils/index.js';

export const router = new Router();

router.get('/', asyncHandler(async (req, res) => {
  const streams = await youtube.listStreams();
  res.json(streams.data.items);
}));

router.post('/', asyncHandler(async (req, res) => {
  const {
    title = null,
    resolution = '720p',
    frameRate = '30fps',
  } = req.body;
  if (typeof title !== 'string' || title.length > 128) {
    if (!title) throw new APIError(400, Object.assign({ body: 'Title must be a string between 1 & 128 chars' }));
  }
  const { data } = await youtube.addStream({
    title,
    resolution,
    frameRate,
  });
  res.sendStatus(200);
  ws.broadcastToAll('streams/ADD_SUCCESS', data);
}));

router.put('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const stream = await youtube.renameStream(id, title);
  res.json(stream);
  ws.broadcastToAll('streams/RENAME_SUCCESS', {
    id, title,
  });
}));

router.delete('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  await youtube.removeStream(id);
  res.json();
  ws.broadcastToAll('streams/DELETE_SUCCESS', id);
}));
