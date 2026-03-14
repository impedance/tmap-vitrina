import fs from 'node:fs';
import path from 'node:path';

// Jest runs in an environment where binding to TCP ports may be restricted.
// Use a dedicated SQLite file in /tmp and copy an already-migrated DB as a baseline.
const sourceDb = path.resolve(__dirname, '../dev.db');
const targetDb = '/tmp/tmap-vitrina-test.db';

try {
    fs.copyFileSync(sourceDb, targetDb);
} catch (e) {
    // If copy fails (e.g. missing source), fall back to using the dev DB directly.
}

process.env.DATABASE_URL = fs.existsSync(targetDb) ? `file:${targetDb}` : 'file:./dev.db';

