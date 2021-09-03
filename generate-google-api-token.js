// This authenticator saves single client Google credentials
// for a particular account to ./tokens.json
//

import fs from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';
import open from 'open';
import { google } from 'googleapis';
import { config } from './lib/config.js';

const thisDir = dirname(fileURLToPath(import.meta.url));

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
      fs.writeFileSync(join(thisDir, 'google-token.json'), JSON.stringify(tokens, null, 2)));
  rl.close();
});
