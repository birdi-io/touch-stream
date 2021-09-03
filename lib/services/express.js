import express from 'express';
import passport from 'passport';
import cors from 'cors';
import { errorHandler } from '../utils/index.js';
import { config } from '../config.js';
import pino from './log.js';

export default (routes) => {
  const app = express();
  app.use(cors({ credentials: true, origin: true }));
  app.options('/*', cors({ credentials: true, origin: true }), (req, res) => { res.status(200).send('OK'); });
  app.use((req, res, next) => {
    const start = Date.now();
    pino.debug(
      '[Start] %s: %s',
      req.method,
      req.originalUrl,
    );
    res.on('finish', () => {
      pino.info(
        '[End] %s: %s %d ms %s',
        req.method,
        req.originalUrl,
        Date.now() - start,
        res.statusCode,
      );
    });
    next();
  });
  app.use(passport.initialize());
  app.use(routes);
  app.get('/', (req, res) => res.status(200).json({
    env: config.NODE_ENV,
  }));
  app.all('*', (req, res) => res.status(404).end());
  app.use(errorHandler);
  return app;
};
