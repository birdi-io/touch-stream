import { Router } from 'express';
import { sign } from '../services/jwt/index.js';
import { json, authorise } from '../services/passport/index.js';

export const router = new Router();

router.post('/', json, (req, res) => {
  const jwt = sign(req.user, { expiresIn: '15d' });
  res.status(200).json({ jwt });
});

router.get('/validate', authorise(), (req, res) =>
  res.sendStatus(200));

