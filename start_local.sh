#!/bin/bash

# Local Start Script for MultiWork
# Usage: ./start_local.sh
# Run this from the project root directory

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

echo ">>> Stopping and removing old containers..."
# Explicitly stop before removing to avoid conflicts
# Use || true to suppress errors if containers don't exist
docker stop redis-local multiwork-backend multiwork-frontend multiwork-gateway || true
docker rm -f redis-local multiwork-backend multiwork-frontend multiwork-gateway || true
$COMPOSE_CMD -f docker-compose.yml down --remove-orphans

echo ">>> Building local environment (No Cache)..."
# Force no-cache build to ensure REACT_APP_API_URL change is picked up
$COMPOSE_CMD -f docker-compose.yml build --no-cache

echo ">>> Starting services..."
$COMPOSE_CMD -f docker-compose.yml up -d --remove-orphans

echo ">>> Waiting for services to initialize..."
sleep 5
$COMPOSE_CMD -f docker-compose.yml ps

echo ">>> Local Environment Started!"
echo " Client: http://localhost"
echo " Backend: http://localhost:8080"
echo " Backend Health: http://localhost:8080/actuator/health"
echo ""
echo " To view logs: $COMPOSE_CMD -f docker-compose.yml logs -f"
echo " To stop: $COMPOSE_CMD -f docker-compose.yml down"
