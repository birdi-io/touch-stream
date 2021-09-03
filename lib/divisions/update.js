import { db } from '../services/mongo/index.js';
import pino from '../services/log.js';

export async function updateDivisions() {
  const matches = await db.collection('matches').find({}).toArray();
  const divisions = await matches.reduce((set, match) => {
    if (!match.comp) return set;
    set.add(match.comp);
    return set;
  }, new Set());
  const inserts = [];
  divisions.forEach((division) => {
    inserts.push({
      name: division,
    });
  });
  await db.collection('divisions').deleteMany({});
  await db.collection('divisions').insertMany(inserts);
  pino.info('Updated divisions');
}
