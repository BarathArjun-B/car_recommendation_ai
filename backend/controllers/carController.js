import Car from '../models/Car.js';
import { findCarByIdentifier, queryCars } from '../services/carQueryService.js';
import eventLogger from '../utils/eventLogger.js';

export const getCars = async (req, res, next) => {
  try {
    const result = await queryCars(req.query);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getNewCars = async (req, res, next) => {
  try {
    const result = await queryCars({ ...req.query, condition: 'new' });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getUsedCars = async (req, res, next) => {
  try {
    const result = await queryCars({ ...req.query, condition: 'used' });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getCarById = async (req, res, next) => {
  try {
    const result = await findCarByIdentifier(req.params.id);

    if (!result?.car) {
      res.status(404);
      throw new Error('Car not found');
    }

    eventLogger.emit('carViewed', { carId: result.car._id || result.car.sourceId, model: result.car.model });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const createCar = async (req, res, next) => {
  try {
    const car = await Car.create({
      source: req.body.source || 'manual',
      sourceId: req.body.sourceId || `${req.body.brand}-${req.body.model}-${Date.now()}`.toLowerCase(),
      slug:
        req.body.slug ||
        `${req.body.brand}-${req.body.model}-${req.body.year || new Date().getFullYear()}`
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-'),
      ...req.body,
    });
    res.status(201).json({ success: true, car });
  } catch (error) {
    next(error);
  }
};
