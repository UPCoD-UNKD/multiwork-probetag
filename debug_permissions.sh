#!/bin/bash

# Load environment variables
if [ -f .env.production ]; then
    export $(cat .env.production | grep -v '^#' | xargs)
else
    echo "❌ Error: .env.production file not found!"
    exit 1
fi

echo ">>> Testing Database Permissions for user: $SPRING_DATASOURCE_USERNAME"

docker run --rm \
    -e PGPASSWORD=$SPRING_DATASOURCE_PASSWORD \
    -e PGSSLMODE=require \
    alpine sh -c "apk add --no-cache postgresql-client && \
    echo '>>> Attempting to create a test table...' && \
    psql -h multiwork.postgres.database.azure.com -U $SPRING_DATASOURCE_USERNAME -d postgres -c 'CREATE TABLE IF NOT EXISTS permission_test (id serial PRIMARY KEY);' && \
    echo '✅ Table creation SUCCESSFUL' && \
    psql -h multiwork.postgres.database.azure.com -U $SPRING_DATASOURCE_USERNAME -d postgres -c 'DROP TABLE permission_test;' && \
    echo '✅ Table drop SUCCESSFUL'"

if [ $? -ne 0 ]; then
    echo "❌ PERMISSION CHECK FAILED. User might not have privileges to create tables."
fi
