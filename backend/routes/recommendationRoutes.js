import express from 'express';
import { generateRecommendations } from '../controllers/recommendationController.js';

const router = express.Router();

router.post('/', generateRecommendations);

export default router;
