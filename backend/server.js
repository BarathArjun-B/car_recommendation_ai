
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import carRoutes from './routes/carRoutes.js';
import ingestionRoutes from './routes/ingestionRoutes.js';

import { startIngestionCron } from './jobs/ingestionCron.js';

import { errorHandler } from './middleware/errorMiddleware.js';
import { notFound } from './middleware/notFoundMiddleware.js';

import eventLogger from './utils/eventLogger.js';
import { ensureLogDirectory } from './utils/fileHandler.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5001;

// Ensure logs folder exists
ensureLogDirectory();

// Middleware
app.use(express.json());

// CORS Configuration
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://car-recommendation-ai.vercel.app',
    ],
    credentials: true,
  })
);

// Health Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'BAVH Motors AI backend is running',
    environment: process.env.NODE_ENV || 'development',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/ingestion', ingestionRoutes);

// Error Middleware
app.use(notFound);
app.use(errorHandler);

// Start Server
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      eventLogger.emit('serverStarted', {
        port: PORT,
        timestamp: new Date().toISOString(),
      });

      startIngestionCron();

      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Server startup failed: ${error.message}`);
    process.exit(1);
  }
};

startServer();
