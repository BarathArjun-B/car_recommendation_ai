import { useCallback, useMemo, useState } from 'react';
import cars from '../data/indianCarsDB.json';

const simulateFetch = (resolver) =>
  new Promise((resolve, reject) => {
    window.setTimeout(() => {
      try {
        resolve(resolver());
      } catch (error) {
        reject(error);
      }
    }, 350);
  });

export const useCarData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const runQuery = useCallback(async (resolver) => {
    setLoading(true);
    setError('');

    try {
      return await simulateFetch(resolver);
    } catch (queryError) {
      setError(queryError.message || 'Unable to fetch cars');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getAllCars = useCallback(() => runQuery(() => cars), [runQuery]);

  const getNewCars = useCallback(() => runQuery(() => cars.filter((car) => car.condition === 'new')), [runQuery]);

  const getUsedCars = useCallback(() => runQuery(() => cars.filter((car) => car.condition === 'used')), [runQuery]);

  const getCarById = useCallback(
    (id) =>
      runQuery(() => {
        const car = cars.find((item) => item.id === id);
        if (!car) throw new Error('Car not found');
        return car;
      }),
    [runQuery],
  );

  const filterCars = useCallback(
    ({ brand = 'All', budget = '', bodyType = 'All', query = '' }) =>
      runQuery(() =>
        cars.filter((car) => {
          const searchable = `${car.brand} ${car.model} ${car.fuel_type} ${car.transmission} ${car.type}`.toLowerCase();
          const matchesBrand = brand === 'All' || car.brand === brand;
          const matchesBudget = !budget || car.price_in_lakhs <= Number(budget);
          const matchesBodyType = bodyType === 'All' || car.type === bodyType;
          const matchesQuery = !query || searchable.includes(query.toLowerCase());
          return matchesBrand && matchesBudget && matchesBodyType && matchesQuery;
        }),
      ),
    [runQuery],
  );

  const metadata = useMemo(
    () => ({
      brands: ['All', ...new Set(cars.map((car) => car.brand))],
      bodyTypes: ['All', ...new Set(cars.map((car) => car.type))],
      maxBudget: Math.ceil(Math.max(...cars.map((car) => car.price_in_lakhs))),
    }),
    [],
  );

  return {
    loading,
    error,
    metadata,
    getAllCars,
    getNewCars,
    getUsedCars,
    getCarById,
    filterCars,
  };
};
