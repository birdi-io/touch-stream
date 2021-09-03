// This authenticator saves single client Google credentials
// for a particular account to ./tokens.json

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import open from 'open';
import { google } from 'googleapis';
import { config } from './lib/config.js';

const oauth2Client = new google.auth.OAuth2(
  config.GOOGLE_CLIENT_ID,
  config.GOOGLE_CLIENT_SECRET,
  'https://birdi.com.au/',
);

const scopes = [
  'https://www.googleapis.com/auth/youtube.force-ssl',
];

const url = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  approval_prompt: 'force',
  scope: scopes,
});

open(url);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Enter code from returned query string ', (answer) => {
  oauth2Client.getToken(decodeURIComponent(answer))
    .then(({ tokens }) =>
      fs.writeFileSync(path.join(__dirname, 'tokens.new.json'), JSON.stringify(tokens, null, 2)));
  rl.close();
});
