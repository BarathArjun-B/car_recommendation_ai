import { carsData } from '../data/carsData.js';
import { normalizeText } from '../utils/helpers.js';

export const getAllCars = () => carsData;

export const getCarById = (id) => carsData.find((car) => car.id === id);

export const getCarsByType = (type) => carsData.filter((car) => car.type === type);

export const getSimilarCars = (car, limit = 3) =>
  carsData
    .filter((item) => item.id !== car.id && (item.brand === car.brand || item.type === car.type))
    .slice(0, limit);

export const filterCars = (cars, filters) => {
  const query = normalizeText(filters.query);
  return cars.filter((car) => {
    const searchable = normalizeText(`${car.title} ${car.brand} ${car.fuelType} ${car.location}`);
    return (
      (!query || searchable.includes(query)) &&
      (filters.brand === 'All' || car.brand === filters.brand) &&
      (filters.fuelType === 'All' || car.fuelType === filters.fuelType) &&
      (!filters.maxPrice || car.price <= Number(filters.maxPrice))
    );
  });
};

export const sortCars = (cars, sortBy) => {
  const next = [...cars];
  if (sortBy === 'price-low') return next.sort((a, b) => a.price - b.price);
  if (sortBy === 'price-high') return next.sort((a, b) => b.price - a.price);
  if (sortBy === 'year-new') return next.sort((a, b) => b.year - a.year);
  return next.sort((a, b) => b.rating - a.rating);
};
