import express from 'express';
import cors from 'cors';
import { PORT, FRONTEND_URL } from './config/env.js';
import healthRoutes from './routes/healthRoutes.js';
import incidentRoutes from './routes/incidentRoutes.js';
import diagnosticRoutes from './routes/diagnosticRoutes.js';
import capaRoutes from './routes/capaRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Configure CORS to permit local frontend requests
const allowedOrigins = [
  FRONTEND_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      return callback(null, true);
    }
    return callback(null, true); // Permissive for local development
  },
  credentials: true
}));

// Configure JSON request body parsing
app.use(express.json());

// API Routes
app.use('/api', healthRoutes);
app.use('/api', incidentRoutes);
app.use('/api', diagnosticRoutes);
app.use('/api', capaRoutes);

// Global Error Handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`EcoSentinel AI backend is running on http://localhost:${PORT}`);
});

export default app;

