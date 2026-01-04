#!/bin/bash

# Update Script for MultiWork
# Usage: ./update.sh
# Run this from the project root directory on the server

set -e

echo ">>> Pulling latest changes from Git..."
git pull origin production

echo ">>> Rebuilding and restarting containers..."
# -f points to the production compose file
# -d runs in detached mode
# --build forces a rebuild of images
# --remove-orphans cleans up containers not defined in the compose file
docker compose -f docker-compose.prod.yml up -d --build --remove-orphans

echo ">>> Waiting for health checks..."
sleep 5
docker compose -f docker-compose.prod.yml ps

echo ">>> Cleaning up old docker images..."
docker image prune -f

echo ">>> Update Complete!"
echo " Logs: docker compose -f docker-compose.prod.yml logs -f"
