#!/bin/bash

# Load environment variables
if [ -f .env.production ]; then
    export $(cat .env.production | grep -v '^#' | xargs)
else
    echo "❌ Error: .env.production file not found!"
    exit 1
fi

echo ">>> Testing Database Connection..."
echo "HOST: multiwork.postgres.database.azure.com"
echo "USER: $SPRING_DATASOURCE_USERNAME"
echo "DB:   postgres"

# Run a temporary alpine container with postgresql-client
docker run --rm \
    -e PGPASSWORD=$SPRING_DATASOURCE_PASSWORD \
    alpine sh -c "apk add --no-cache postgresql-client && \
    psql -h multiwork.postgres.database.azure.com -U $SPRING_DATASOURCE_USERNAME -d postgres -c '\l' && \
    echo '✅ CONNECTION SUCCESSFUL!'"

if [ $? -ne 0 ]; then
    echo "❌ CONNECTION FAILED. Check your username, password, or firewall rules."
fi
