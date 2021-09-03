/**
 * This file generates an auth token to sign in with (I think?)
 */

import jwt from 'jsonwebtoken';
import { config } from './lib/config.js';

const base64 = jwt.sign({ id: 'whatever' }, config.TOUCH_SECRET);

console.log(`UI authentication token:\n${base64}`);
