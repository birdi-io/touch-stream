import { Router } from 'express';
import { asyncHandler } from '../utils/index.js';
import { db } from '../services/mongo/index.js';

function getLocations() {
  return db.collection('matches').distinct('location');
}

export const router = new Router();

router.get('/', asyncHandler(async (req, res) => {
  res.json(await getLocations());
}));
