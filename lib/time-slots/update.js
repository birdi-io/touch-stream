import { startOfDay } from 'date-fns';
import mongo from '../services/mongo/index.js';
import pino from '../services/log.js';

export async function updateTimeslots() {
  const matches = await mongo.db.collection('matches').find({}).toArray();
  const timeslotsMap = await matches.reduce((acc, match) => {
    const startDay = startOfDay(match.scheduledStartTime);
    const startTime = match.scheduledStartTime;
    if (!Array.isArray(acc[startDay])) {
      acc[startDay] = [];
    }
    if (!acc[startDay].includes(startTime)) acc[startDay].push(startTime);
    return acc;
  }, {});
  const inserts = [];
  Object.keys(timeslotsMap).forEach((key) => {
    timeslotsMap[key].map((time) => {
      inserts.push({
        day: new Date(key),
        time,
      });
    });
  }, []);
  await mongo.db.collection('time-slots').deleteMany({});
  await mongo.db.collection('time-slots').insertMany(inserts);
  pino.info('Updated timeslots');
}
