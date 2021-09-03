import mongo from '../services/mongo/index.js';
import pino from '../services/log.js';

export async function updateDivisions() {
  const matches = await mongo.db.collection('matches').find({}).toArray();
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
  await mongo.db.collection('divisions').deleteMany({});
  await mongo.db.collection('divisions').insertMany(inserts);
  pino.info('Updated divisions');
}
