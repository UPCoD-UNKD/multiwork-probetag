#!/bin/bash

# Update Script for MultiWork
# Usage: ./update.sh
# Run this from the project root directory on the server

set -e

# Detect Docker Compose command
if docker compose version >/dev/null 2>&1; then
    COMPOSE_CMD="docker compose"
    echo ">>> Using 'docker compose' (v2)"
elif command -v docker-compose >/dev/null 2>&1; then
    COMPOSE_CMD="docker-compose"
    echo ">>> Using 'docker-compose' (legacy)"
else
    echo ">>> Error: Docker Compose not found. Please install docker-compose-plugin or docker-compose."
    exit 1
fi

echo ">>> Pulling latest changes from Git..."
# Dynamically detect current branch
BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo ">>> Detected branch: $BRANCH"
git pull origin "$BRANCH"

echo ">>> stopping old containers..."
# Force removal of all containers to prevent legacy docker-compose KeyErrors
# (This causes a few seconds of downtime but ensures stability)
if [ "$(docker ps -a -q)" ]; then
    docker rm -f $(docker ps -a -q)
fi

echo ">>> Rebuilding and restarting containers..."
# -f points to the production compose file
# -d runs in detached mode
# --build forces a rebuild of images
# --remove-orphans cleans up containers not defined in the compose file
$COMPOSE_CMD -f docker-compose.prod.yml up -d --build --remove-orphans

echo ">>> Waiting for health checks..."
sleep 5
$COMPOSE_CMD -f docker-compose.prod.yml ps

echo ">>> Cleaning up old docker images..."
docker image prune -f

echo ">>> Update Complete!"
echo " Logs: $COMPOSE_CMD -f docker-compose.prod.yml logs -f"
