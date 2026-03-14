#!/usr/bin/env bash
set -e

echo "🗄️  Pushing database schema with Drizzle..."
cd /app/server
npx drizzle-kit push

echo "🚀 Starting dev servers..."
cd /app
exec npm run dev
