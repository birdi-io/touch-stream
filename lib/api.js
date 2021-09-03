import { Router, json } from 'express';
import { config } from './config.js';
import { authorise } from './services/passport/index.js';
import { router as auth } from './auth/index.js';
import { router as streams } from './streams/index.js';
import { router as broadcasts } from './broadcasts/index.js';
import { router as matches } from './matches/index.js';
import { router as sync } from './fit-sync/index.js';
import { router as timeSlots } from './time-slots/index.js';
import { router as teams } from './teams/index.js';
import { router as divisions } from './divisions/index.js';
import { router as locations } from './locations/index.js';

export const router = new Router();

router.use(json());
router.use('/auth', auth);
router.use('/streams', authorise(), streams);
router.use('/broadcasts', authorise(), broadcasts);
router.use('/matches', authorise(), matches);
router.use('/divisions', authorise(), divisions);
router.use('/locations', authorise(), locations);
router.use('/teams', authorise(), teams);
router.use('/sync', authorise(), sync);
router.use('/time-slots', authorise(), timeSlots);
router.get('/', (req, res) =>
  res.status(200).json({
    env: config.ENV,
    version: config.VERSION,
  }));
// 404 handler
router.all('*', (req, res) =>
  res.status(404).end());
