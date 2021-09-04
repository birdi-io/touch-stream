#!/bin/bash
# Proxies API with SSH

docker run \
  -v 'certs:/etc/letsencrypt' \
  -v '/srv/proxy.conf:/etc/nginx/conf.d/proxy.conf:ro' \
  -p '80:80' \
  -p '443:443' \
  --network touch-stream \
  --name nginx \
  nginx
