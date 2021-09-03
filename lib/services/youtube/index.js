import fs from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { google } from 'googleapis';
import { teams } from '../../schema/schema.js';
import { config } from '../../config.js';

export const oAuth2Client = new google.auth.OAuth2(
  config.GOOGLE_CLIENT_ID,
  config.GOOGLE_CLIENT_SECRET,
  'https://birdi.com.au/',
);

const thisDir = dirname(fileURLToPath(import.meta.url));
const credentials = fs.readFileSync(join(thisDir, '../../../google-tokens.json'));

oAuth2Client.credentials = credentials;

export const youtube = google.youtube({
  version: 'v3',
  auth: oAuth2Client,
});

export function addBroadcast(opts) {
  return youtube.liveBroadcasts.insert({
    part: 'snippet,status,contentDetails',
    resource: {
      snippet: {
        title: opts.title,
        scheduledStartTime: opts.scheduledStartTime,
        scheduledEndTime: opts.scheduledEndTime,
        description: opts.description,
      },
      contentDetails: {
        monitorStream: {
          enableMonitorStream: false,
        },
      },
      status: {
        privacyStatus: 'public',
      },
    },
  });
}

export function removeBroadcast(id) {
  return youtube.liveBroadcasts.delete({ id });
}

export function addStream(opts) {
  return youtube.liveStreams.insert({
    part: 'id,snippet,cdn,contentDetails',
    resource: {
      snippet: {
        title: opts.title,
      },
      cdn: {
        frameRate: opts.frameRate,
        resolution: opts.resolution,
        ingestionType: 'rtmp',
      },
      contentDetails: {
        isReusable: true,
      },
    },
  });
}

export function removeStream(id) {
  return youtube.liveStreams.delete({ id });
}

export function listStreams() {
  return youtube.liveStreams.list({
    part: 'id,snippet,cdn,status',
    mine: true,
    maxResults: 50,
  });
}

export function listBroadcastsByStatus(status = 'active', part = 'id,snippet,contentDetails,status') {
  return youtube.liveBroadcasts.list({
    part,
    broadcastStatus: status,
    maxResults: 50,
  });
}

export function getStream(id) {
  return youtube.liveStreams.list({
    part: 'id,snippet,cdn,status',
    id,
  });
}

export async function renameStream(id, title) {
  const res = await youtube.liveStreams.list({
    part: 'id,snippet,cdn',
    id,
  });
  const stream = res.data.items[0];
  return youtube.liveStreams.update({
    part: 'snippet,cdn',
    requestBody: {
      id,
      snippet: {
        title,
      },
      cdn: {
        frameRate: stream.cdn.frameRate,
        resolution: stream.cdn.resolution,
        ingestionType: stream.cdn.ingestionType,
      },
    },
  });
}

export function bindStreamToBroadcast(streamId, broadcastId) {
  const opts = {
    id: broadcastId,
    part: 'id,snippet',
    streamId,
  };
  return youtube.liveBroadcasts.bind(opts);
}

export function unbindStream(youtubeId) {
  const opts = {
    id: youtubeId,
    part: 'id,snippet',
  };
  return youtube.liveBroadcasts.bind(opts);
}

export function transition(id, status) {
  return youtube.liveBroadcasts.transition({
    part: 'id,snippet,contentDetails,status',
    broadcastStatus: status,
    id,
  });
}

export async function updateThumbnail(id, thumbnailData) {
  const req = await youtube.liveBroadcasts.list({
    id,
    part: 'id,snippet,contentDetails,status',
  });
  const video = req.data.items[0];
  const opts = {
    videoId: video.id,
    media: {
      mimeType: 'image/jpeg',
      body: thumbnailData,
    },
  };
  return youtube.thumbnails.set(opts);
}

export function getRoundPretty(round) {
  if (typeof Number(round) && !isNaN(Number(round))) {
    return `Round ${round}`;
  }
  return round;
}

export function genTitle(record) {
  if (!record.teamA || !record.teamB) {
    return `${record.comp}, ${getRoundPretty(record.round)} | European Touch Junior Championships 2019`;
  }
  return `${teams[record.teamA].name} vs ${teams[record.teamB].name}, ${record.comp}, ${getRoundPretty(record.round)} | European Touch Junior Championships 2019`;
}

export const footer = `
European Touch Junior Championships 2019
Streamed live in Paris, France

FIT https://www.internationaltouch.org/
247.tv Broadcasting & Production https://247.tv
`;

export function genDescription(record) {
  if (!record.teamA || !record.teamB) {
    return `Teams TBA
${getRoundPretty(record.round)}
${record.comp}
${footer}
`;
  }
  return `${teams[record.teamA].name} vs ${teams[record.teamB].name}
${getRoundPretty(record.round)}
${record.comp}
${footer}
`;
}
