#!/bin/bash

WORK_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
CONTAINER=touch-mongo
DB_NAME=touch-dev
NETWORK_NAME=touch

echo "Creating Docker network '$NETWORK_NAME'"
docker network create $NETWORK_NAME &>/dev/null

echo "Attempting to delete container '$CONTAINER'"
docker stop $CONTAINER &>/dev/null
echo "Creating container '$CONTAINER'"
docker run -e 'TZ=Australia/Sydney' -d --rm -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=dev \
  -e MONGO_INITDB_ROOT_PASSWORD=dev \
  --network $NETWORK_NAME --name $CONTAINER \
  mongo:5.0.2 mongod --storageEngine wiredTiger --auth

# Wait for connection
echo waiting for a mate
until docker exec $CONTAINER mongosh -u dev -p dev --eval 'db.getMongo()' &>/dev/null
  do echo "Waiting for MongoDB"
  sleep 1
done

echo "Creating global user"
docker exec $CONTAINER mongosh $DB_NAME \
  -u dev -p dev \
  --authenticationDatabase admin \
  --eval 'db.createUser({user:"dev",pwd:"dev",roles:["readWrite","dbAdmin"]})'
