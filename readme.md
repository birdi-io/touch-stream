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

## Front-end
- See github.com/birdi/touch-stream-ui

## API Deployment
- See deploy/readme.md for deploying Mongo & the API on a single Debian instance.
- See vultr

## Acknowlegements
- [BIRDI](https://birdi.com.au)
- [Daniel Gormly](https://github.com/danielgormly)

## TODO:
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

## License
TBD
