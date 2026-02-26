#!/usr/bin/env bash
set -e

echo "🔧 Generating Prisma client..."
cd /app/server
npx prisma generate

echo "🗄️  Pushing database schema..."
npx prisma db push --accept-data-loss

echo "🚀 Starting dev servers..."
cd /app
exec npm run dev
