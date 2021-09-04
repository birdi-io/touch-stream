#!/bin/bash
# Runs API

docker run \
  -v '/srv/config.yaml:/home/me/app/config.yaml' \
  --network touch-stream \
  --name touch-api \
  10.0.0.22:443/api:lifeboat
