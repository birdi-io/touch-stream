import { Router } from 'express';
import * as youtube from '../services/youtube/index.js';
import { asyncHandler } from '../utils/index.js';

export const router = new Router();

router.get('/:status', asyncHandler(async (req, res) => {
  const streams = await youtube.listBroadcastsByStatus(req.params.status);
  res.json(streams.data.items);
}));
