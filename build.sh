#/bin/bash

VER=$(git log --pretty=format:"%h" | head -1)

docker buildx build \
  --platform linux/amd64 \
  --tag danielgormly/touch-api:$VER \
  --progress=plain \
  --push \
  .
