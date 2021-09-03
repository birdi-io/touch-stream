import { Router } from 'express';
import { asyncHandler } from '../utils/index.js';
import mongo from '../services/mongo/index.js';

function getTimeslots() {
  return mongo.db.collection('time-slots').find({}).toArray();
}

function getDistinctDays() {
  return mongo.db.collection('time-slots').distinct('day');
}

export const router = new Router();

router.get('/', asyncHandler(async (req, res) => {
  res.json(await getTimeslots());
}));

router.get('/days', asyncHandler(async (req, res) => {
  res.json(await getDistinctDays());
}));
