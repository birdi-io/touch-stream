#!/bin/bash
# Runs API

docker run \
  -v '/srv/config.yaml:/home/me/app/config.yaml' \
  -v '/srv/google-token.json:/home/me/app/google-token.json' \
  --network touch-stream \
  --name touch-api \
  danielgormly/touch-api:latest
