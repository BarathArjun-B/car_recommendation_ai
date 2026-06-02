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

ensureLogDirectory();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  }),
);
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'BAVH Motors AI backend is running',
    environment: process.env.NODE_ENV || 'development',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/ingestion', ingestionRoutes);

app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      eventLogger.emit('serverStarted', { port: PORT, timestamp: new Date().toISOString() });
      startIngestionCron();
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Server startup failed: ${error.message}`);
    process.exit(1);
  }
};

startServer();
