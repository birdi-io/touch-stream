import fs from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const thisDir = dirname(fileURLToPath(import.meta.url));
export const teams = fs.readFileSync(join(thisDir, './teams.json'));
export const comps = fs.readFileSync(join(thisDir, './comps.json'));
