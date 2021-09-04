import fs from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const thisDir = dirname(fileURLToPath(import.meta.url));
export const teams = JSON.parse(fs.readFileSync(join(thisDir, './teams.json')));
export const comps = JSON.parse(fs.readFileSync(join(thisDir, './comps.json')));
