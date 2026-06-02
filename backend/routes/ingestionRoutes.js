import express from 'express';
import { getIngestionStatus, syncCars } from '../controllers/ingestionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/status', getIngestionStatus);
router.post('/sync', protect, syncCars);

export default router;
