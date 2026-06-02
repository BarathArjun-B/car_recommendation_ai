import { useEffect, useMemo, useState } from 'react';
import { filterCars, getCarsByType, sortCars } from '../services/carService.js';

export const useFetchCars = (type) => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ query: '', brand: 'All', fuelType: 'All', maxPrice: '' });
  const [sortBy, setSortBy] = useState('rating');

  useEffect(() => {
    setLoading(true);
    const timer = window.setTimeout(() => {
      setCars(type ? getCarsByType(type) : []);
      setLoading(false);
    }, 180);
    return () => window.clearTimeout(timer);
  }, [type]);

  const visibleCars = useMemo(() => sortCars(filterCars(cars, filters), sortBy), [cars, filters, sortBy]);

  return { cars, visibleCars, loading, filters, setFilters, sortBy, setSortBy };
};
