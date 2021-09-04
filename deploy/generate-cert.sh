#!/bin/bash

# This script will generate certs using cloudflare API
# cloudflare.ini API_KEY must be provided

WORK_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
DOMAIN_NAME=touch-api.birdi.com.au

# Create certificate volumes
docker volume create certs

echo Working directory: $WORK_DIR

function generateCert {
  # Run certbot with same volumes to generate SSL
  docker run -it --rm \
    -v certs:/etc/letsencrypt \
    -v $WORK_DIR/cloudflare.ini:/srv/cloudflare.ini:ro \
    certbot/dns-cloudflare \
    certonly \
    --dns-cloudflare \
    --dns-cloudflare-credentials /srv/cloudflare.ini \
    -d $DOMAIN_NAME
}

read -r -p "Do you want to generate a new Let's Encrypt SSL certificate for ${DOMAIN_NAME}? [y/N] " response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])+$ ]]
  then generateCert;
fi
