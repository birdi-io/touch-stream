import Slack from 'slack-node';
import { config } from '../../config.js';
import log from '../log';

module.exports = (message) => {
  if (config.ROUTE_COMMS_TO_STDOUT) {
    log.info('Slack message: ', message);
    return Promise.resolve('pino');
  }
  const slack = new Slack();
  slack.setWebhook(config.SLACK_WEBHOOK_URL);
  return new Promise((resolve, reject) =>
    slack.webhook({
      text: message,
    }, (err, response) => {
      if (err) return reject(err);
      return resolve(response);
    }));
};
