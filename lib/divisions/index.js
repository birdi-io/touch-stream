import { Router } from 'express';
import { asyncHandler } from '../utils/index.js';
import { db } from '../services/mongo/index.js';

function getDivisions() {
  return db.collection('divisions').find({}).toArray();
}

export const router = new Router();

router.get('/', asyncHandler(async (req, res) => {
  res.json(await getDivisions());
}));
