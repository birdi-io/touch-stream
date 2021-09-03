import { Router } from 'express';
import { asyncHandler } from '../utils/index.js';
import mongo from '../services/mongo/index.js';
// TODO: Use a dynamic country code module
import fs from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const thisDir = dirname(fileURLToPath(import.meta.url));
const teamsDef = fs.readFileSync(join(thisDir, '../schema/teams.json'));

async function getTeams() {
  const teamA = await mongo.db.collection('matches').distinct('teamA');
  const teamB = await mongo.db.collection('matches').distinct('teamB');
  const teams = teamA.concat(teamB).reduce((set, team) => {
    if (!team) return set;
    set.add(team);
    return set;
  }, new Set());
  const distinctTeamsArray = Array.from(teams);
  return distinctTeamsArray.map(countryCode =>
    Object.assign(teamsDef[countryCode], { code: countryCode }));
}

export const router = new Router();

router.get('/', asyncHandler(async (req, res) => {
  res.json(await getTeams());
}));
