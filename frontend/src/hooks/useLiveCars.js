import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchCars, fetchNewCars, fetchUsedCars } from '../services/carApi.js';

const buildParams = ({ filters, page, limit }) => ({
  page,
  limit,
  q: filters.query || undefined,
  brand: filters.brand !== 'All' ? filters.brand : undefined,
  budget: filters.budget || undefined,
  bodyType: filters.bodyType !== 'All' ? filters.bodyType : undefined,
  fuel_type: filters.fuelType !== 'All' ? filters.fuelType : undefined,
  transmission: filters.transmission !== 'All' ? filters.transmission : undefined,
});

export const useLiveCars = (condition = 'all') => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, source: 'api' });
  const [filters, setFilters] = useState({
    query: '',
    brand: 'All',
    budget: '',
    bodyType: 'All',
    fuelType: 'All',
    transmission: 'All',
  });

  const metadata = useMemo(
    () => ({
      brands: ['All', 'Tata', 'Mahindra', 'Hyundai', 'Kia', 'Maruti Suzuki', 'BMW', 'Audi', 'Mercedes'],
      bodyTypes: ['All', 'SUV', 'Sedan', 'Hatchback', 'MUV', 'Coupe', 'EV'],
      fuelTypes: ['All', 'Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'],
      transmissions: ['All', 'Manual', 'Automatic', 'DCT', 'CVT', 'AMT'],
    }),
    [],
  );

  const loadCars = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const params = buildParams({ filters, page, limit: 12 });
      const loader = condition === 'new' ? fetchNewCars : condition === 'used' ? fetchUsedCars : fetchCars;
      const data = await loader(params);
      setCars(data.cars || []);
      setPagination({
        total: data.total || 0,
        totalPages: data.totalPages || 1,
        source: data.source || 'api',
      });
    } catch (apiError) {
      setError(apiError.response?.data?.message || apiError.message || 'Unable to load live car data');
      setCars([]);
    } finally {
      setLoading(false);
    }
  }, [condition, filters, page]);

  useEffect(() => {
    loadCars();
  }, [loadCars]);

  return {
    cars,
    loading,
    error,
    page,
    setPage,
    pagination,
    filters,
    setFilters,
    metadata,
    refetch: loadCars,
  };
};
