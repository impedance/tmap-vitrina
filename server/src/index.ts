import app from './app';
import dotenv from 'dotenv';
import { initDatabase } from './utils/db-init';

dotenv.config();

const PORT = process.env.PORT || 3000;

// Initialize database and seed data
initDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}).catch((err) => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
});
