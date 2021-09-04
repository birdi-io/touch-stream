import fetch from 'node-fetch';
import { config } from '../../config.js';

export const addYoutubeEvent = (eventId, youtubeId) =>
  fetch(`${config.FIT_API_URL}/youtube`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${config.FIT_TOKEN}`,
    },
    body: JSON.stringify({
      id: eventId,
      youtubeId,
    }),
  });

export const deleteYoutubeEvent = (eventId, youtubeId) =>
  fetch(`${config.FIT_API_URL}/youtube`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${config.FIT_TOKEN}`,
    },
    body: JSON.stringify({
      id: eventId,
      youtubeId,
    }),
  });

export const getAllMatches = () =>
  fetch(`${config.FIT_MATCHES_ENDPOINT}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  }).then((res) => res.json());
