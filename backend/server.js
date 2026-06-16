
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import carRoutes from './routes/carRoutes.js';
import ingestionRoutes from './routes/ingestionRoutes.js';
import recommendationRoutes from './routes/recommendationRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

import { startIngestionCron } from './jobs/ingestionCron.js';

import { errorHandler } from './middleware/errorMiddleware.js';
import { notFound } from './middleware/notFoundMiddleware.js';

import eventLogger from './utils/eventLogger.js';
import { ensureLogDirectory } from './utils/fileHandler.js';
import { validateEnv } from './utils/envValidator.js';
import mongoose from 'mongoose';

dotenv.config();
validateEnv();

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
      process.env.FRONTEND_URL,
      'https://car-recommendation-ai.vercel.app',
    ].filter(Boolean),
    credentials: true,
  })
);

// Health Route
app.get('/api/health', (req, res) => {
  const isMongoConnected = mongoose.connection.readyState === 1;
  const hasApiNinjasKey = !!process.env.API_NINJAS_KEY;
  const hasUnsplashKey = !!process.env.UNSPLASH_ACCESS_KEY;
  
  res.status(200).json({
    success: true,
    message: 'BAVH Motors AI backend is running',
    environment: process.env.NODE_ENV || 'development',
    status: {
      mongodb: isMongoConnected ? 'connected' : 'disconnected',
      apiNinjas: hasApiNinjasKey ? 'configured' : 'missing_key',
      unsplash: hasUnsplashKey ? 'configured' : 'missing_key'
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/ingestion', ingestionRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/chat', chatRoutes);

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
