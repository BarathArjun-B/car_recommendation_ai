import { useEffect, useState } from 'react';
import CarGrid from '../components/CarGrid/CarGrid.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { fetchCars } from '../services/carApi.js';

const Wishlist = () => {
  const { wishlist } = useAuth();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    fetchCars({ limit: 48 })
      .then((data) => {
        setCars((data.cars || []).filter((car) => wishlist.includes(car.slug || car._id || car.sourceId)));
      })
      .catch((apiError) => setError(apiError.response?.data?.message || apiError.message))
      .finally(() => setLoading(false));
  }, [wishlist]);

  return (
    <section className="container py-5">
      <h1 className="section-title">Wishlist</h1>
      <p className="text-slate-600">Saved cars resolved from the backend cars API.</p>
      <CarGrid cars={cars} loading={loading} error={error} emptyMessage="No saved cars yet." />
    </section>
  );
};

export default Wishlist;
