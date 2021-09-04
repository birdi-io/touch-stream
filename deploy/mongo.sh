#!/bin/bash
# Runs Mongodb

docker run -e 'TZ=Australia/Sydney' \
  -e MONGO_INITDB_ROOT_USERNAME=prod \
  -e MONGO_INITDB_ROOT_PASSWORD=prod \
  --network touch-stream --name mongo \
  -v mongodbdata:/data/db \
  mongo:5.0.2 mongod --storageEngine wiredTiger --auth
