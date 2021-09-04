#!/bin/bash
# Runs Mongodb

docker run -e 'TZ=Australia/Sydney' -d --rm -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=dev \
  -e MONGO_INITDB_ROOT_PASSWORD=dev \
  --network touch-stream --name $CONTAINER \
  mongo:5.0.2 mongod --storageEngine wiredTiger --auth
