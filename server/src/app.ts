import express from 'express';
import cors from 'cors';
import path from 'path';
import productRoutes from './routes/products';
import orderRoutes from './routes/orders';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Optional: Serve React frontend from dist if available
const clientBuildPath = path.join(__dirname, '../../client/dist');
app.use(express.static(clientBuildPath));

// Fallback for non-API routes (SPA routing)
app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
        return next();
    }
    // If running in development and client/dist does not exist, provide a helpful message
    res.sendFile(path.join(clientBuildPath, 'index.html'), (err) => {
        if (err) {
            res.status(200).send(`
            <div style="font-family: sans-serif; padding: 20px;">
                <h1 style="color: #2481cc;">✅ API Backend is running!</h1> 
                <p>Welcome to the <strong>tmap-vitrina</strong> backend.</p>
                <p>If you are developing locally, the Frontend React app is likely running on <a href="http://localhost:5173">http://localhost:5173</a>.</p>
                <p>In production, this port will serve both the API and the static frontend build.</p>
            </div>`);
        }
    });
});

export default app;
