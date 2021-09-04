# @birdi/touch-stream
This project was built for the International Federation of Touch. It provides an interface for orchestrating multiple concurrent live streaming team sport events on YouTube. It has been used across several day and multi-day Touch Football competitions.

## Local development env
- Required: Docker, Node 16+
```bash
cp sample-config.yaml config.yaml # and complete file
npm install # Install dependencies
npm run db # Run local mongo instance
./generate-google-api-tokens.js
npm run start -s # Run API
```

## Getting Youtube credentials
- Note: After periods of inactivity, you may need to refresh this key. Or your daily quota for the youtube v3 data api will reduce to 0 and you will have to create an entire new project.
- Note: You will need to create this app in test mode initially.
1. Open up [Google Cloud Console](https://console.cloud.google.com/apis/api/youtube.googleapis.com/overview)
2. Create OAuth token and input client id and secret into config.yaml
3. Run `node generate-google-api-token` and return input token. If no refresh token is output into google-tokens.json, please go to your associated [Google account](https://myaccount.google.com/u/0/permissions).

## Front-end
- See github.com/birdi/touch-stream-ui

## API Deployment
- See deploy/readme.md for deploying Mongo & the API on a single Debian instance.
- See vultr

## Acknowlegements
- [BIRDI](https://birdi.com.au)
- [Daniel Gormly](https://github.com/danielgormly)

## TODO:
- Allow multiple competitions per instance
- Switch persistence layer to PostgreSQL
- Document API
- Dynamic config
- Youtube config
- Lock ui state midtransition
- Rename stream pending state (can't remember what this is?)
- Uniform dropdowns - use react-select across board
- Automatic transition retries
- Rate limit counter
- Start multiple
- Card 'timeslot' view
- Resource locking
- Group teams by comps, don't assume teams are nations
- Allow custom logos
- Bulk insertion of matches
- Bulk deletion of matches
- Variable stream keys
- User management
- Add Typescript
- Delete timeslot persistence layer (at most store in memory)
- SSH refresh unit

## License
TBD

## Fit Sync Note
There is currently a +1hr modifier to the FIT sync code
