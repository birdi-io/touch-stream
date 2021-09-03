import jwt from 'jsonwebtoken';
import { TOUCH_SECRET } from './secret.prod.json';

const base64 = jwt.sign({ id: 'whatever' }, TOUCH_SECRET);

console.log(base64);
