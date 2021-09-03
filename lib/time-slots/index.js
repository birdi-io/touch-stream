import { Router } from 'express';
import { asyncHandler } from '../utils/index.js';
import { db } from '../services/mongo/index.js';

function getTimeslots() {
  return db.collection('time-slots').find({}).toArray();
}

function getDistinctDays() {
  return db.collection('time-slots').distinct('day');
}

export const router = new Router();

router.get('/', asyncHandler(async (req, res) => {
  res.json(await getTimeslots());
}));

router.get('/days', asyncHandler(async (req, res) => {
  res.json(await getDistinctDays());
}));
