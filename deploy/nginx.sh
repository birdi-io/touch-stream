#!/bin/bash
# Proxies API with SSH

docker run \
  -v 'certs:/etc/letsencrypt' \
  -v '/srv/api.conf:/etc/nginx/conf.d/api.conf:ro' \
  -p '80:80' \
  -p '443:443' \
  --network touch-stream \
  --name nginx \
  nginx
