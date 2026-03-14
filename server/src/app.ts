import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import productRoutes from './routes/products';
import orderRoutes from './routes/orders';

const app = express();
const isProduction = process.env.NODE_ENV === 'production';

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/assets', express.static(path.join(__dirname, '../../client/public/assets')));

app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Serve React frontend from dist in production
if (isProduction) {
    const clientBuildPath = path.join(__dirname, '../../client/dist');
    
    // Serve static files from the React build
    app.use(express.static(clientBuildPath));
    
    // Health check endpoint for container orchestration
    app.get('/api/health', (_req, res) => {
        res.json({ status: 'ok', environment: 'production' });
    });
    
    // Fallback for SPA routing - serve index.html for all non-API routes
    app.use((req, res, next) => {
        if (req.path.startsWith('/api')) {
            return next();
        }
        const indexPath = path.join(clientBuildPath, 'index.html');
        if (fs.existsSync(indexPath)) {
            res.sendFile(indexPath);
        } else {
            res.status(404).json({ error: 'Frontend not found. Build may be missing.' });
        }
    });
} else {
    // Development mode - show helpful message
    app.get('/', (_req, res) => {
        res.send(`
            <div style="font-family: sans-serif; padding: 20px;">
                <h1 style="color: #2481cc;">✅ API Backend is running!</h1>
                <p>Welcome to the <strong>tmap-vitrina</strong> backend.</p>
                <p>If you are developing locally, the Frontend React app is likely running on <a href="http://localhost:5174">http://localhost:5174</a>.</p>
                <p>In production, this port will serve both the API and the static frontend build.</p>
            </div>`);
    });
    
    // Health check endpoint for development
    app.get('/api/health', (_req, res) => {
        res.json({ status: 'ok', environment: 'development' });
    });
}

export default app;
