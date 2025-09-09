#!/bin/bash

echo "Setting up SQLite for local development..."

# Backup original schema if it exists
if [ -f "prisma/schema.prisma" ]; then
    cp prisma/schema.prisma prisma/schema.postgresql.prisma
    echo "✓ Backed up PostgreSQL schema"
fi

# Use SQLite schema
cp prisma/schema.sqlite.prisma prisma/schema.prisma
echo "✓ Switched to SQLite schema"

# Generate Prisma client
npx prisma generate
echo "✓ Generated Prisma client"

# Run migrations
npx prisma migrate dev --name init
echo "✓ Created database and tables"

# Seed the database
npm run prisma:seed
echo "✓ Seeded database with test data"

echo ""
echo "🎉 Local SQLite database is ready!"
echo "You can now run: npm run dev"
echo ""
echo "Test credentials:"
echo "Email: test@example.com"
echo "Password: password123"