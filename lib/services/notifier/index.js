import pino from 'pino'({ level: process.env.NODE_ENV === 'test' ? 'error' : 'info' });
import slack from '../slack';
import { sendHTML } from '../sendgrid';
import config from '../../config';

const defaultOpts = {
	slack: config.env === 'production' || config.env === 'uat',
	email: !!config.notificationEmail,
	pino: true,
};

module.exports = function notifier(message, options) {
	const opts = Object.assign({}, defaultOpts, options);
	// TODO: Show env notification originator
	if (opts.slack) {
		slack(message)
			.catch(err => pino.error('Error sending slack notification', err));
	}
	if (opts.email) {
		if (!config.notificationEmail) return pino.warn('Stopped attempt to send notification email with unset notification email address.');
		sendHTML({
			to: config.notificationEmail,
			from: config.noReplyEmail,
			subject: opts.subject || 'BIRDI Notifier',
			content: opts.body || message,
		})
			.catch(err => pino.error('Error sending email notification', err));
	}
	if (opts.pino) {
		pino.info('Notifier:', message);
	}
};
