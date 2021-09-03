import http from 'http';
import pino from './services/log.js';
import { config } from './config.js';
import mongo, { connectMongo } from './services/mongo/index.js';
import ws from './services/ws/index.js';
import express from './services/express.js';
import { router as api } from './api.js';

const app = express(api);
const server = http.createServer(app);

// TODO: Provide graceful exit interface
await connectMongo().catch(console.dir);
startWs(server);
server.listen(config.PORT, config.HOST, (err) => {
  if (err) throw err;
  pino.info(`
LiveStream API (${config.ENV} mode)
Listening on http://${config.HOST}:${config.PORT}`);
});
