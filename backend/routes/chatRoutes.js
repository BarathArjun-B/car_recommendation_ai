import express from 'express';
import { handleChat, handleExtract } from '../controllers/chatController.js';

const router = express.Router();

router.post('/', handleChat);
router.post('/extract', handleExtract);

export default router;
