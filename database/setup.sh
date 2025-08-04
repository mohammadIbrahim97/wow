#!/bin/bash

# WOW Marketplace Database Setup Script
# This script creates the PostgreSQL database and tables

DB_NAME="wow_marketplace"
DB_USER="wow_user"
DB_PASSWORD="wow_password"
DB_HOST="localhost"
DB_PORT="5432"

echo "Setting up WOW Marketplace Database..."

# Create database and user
echo "Creating database and user..."
sudo -u postgres psql << EOF
CREATE DATABASE $DB_NAME;
CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
ALTER USER $DB_USER CREATEDB;
\q
EOF

# Create tables
echo "Creating tables..."
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f schema.sql

# Insert sample data
echo "Inserting sample data..."
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f sample_data.sql

echo "Database setup completed!"
echo "Database: $DB_NAME"
echo "User: $DB_USER"
echo "Password: $DB_PASSWORD"
echo "Host: $DB_HOST"
echo "Port: $DB_PORT"