import jwt from 'jsonwebtoken';
import { config } from '../../config.js';

export const sign = (id, opts = {
  expiresIn: config.JWT_EXPIRE_SECONDS,
}, secret = config.JWT_SECRET) =>
  jwt.sign({ id }, secret, opts);

export const verify = (token, secret = config.JWT_SECRET) =>
  jwt.verify(token, secret);
