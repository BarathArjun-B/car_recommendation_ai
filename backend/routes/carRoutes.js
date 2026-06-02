import express from 'express';
import { createCar, getCarById, getCars, getNewCars, getUsedCars } from '../controllers/carController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getCars);
router.get('/new', getNewCars);
router.get('/used', getUsedCars);
router.get('/:id', getCarById);
router.post('/', protect, createCar);

export default router;
