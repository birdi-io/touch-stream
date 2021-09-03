import { teams, comps } from './schema.js';

function validateTeam(countryCode) {
  return typeof countryCode === 'string' && typeof teams[countryCode.toLowerCase()] !== 'object';
}

function validateEvent(event) {
  const errors = [];
  if (validateTeam(event.teamA)) {
    errors.push('teamA invalid or undefined');
  }
  if (validateTeam(event.teamB)) {
    errors.push('teamB invalid or undefined');
  }
  if (typeof comps[event.comp] !== 'object') {
    errors.push('comp invalid');
  }
  if (errors.length) return errors;
  return true;
}

const publicProps = [
  'id', 'teamA', 'teamB', 'comp', 'scoreA', 'scoreB',
  'scheduledStartTime', 'youtubeId', 'round', 'location',
];

module.exports = {
  validateEvent,
  publicProps,
};
