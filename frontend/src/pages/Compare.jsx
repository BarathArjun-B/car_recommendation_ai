import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { fetchCars } from '../services/carApi.js';
import { formatLakhs } from '../utils/helpers.js';

const Compare = () => {
  const { compare } = useAuth();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    fetchCars({ limit: 48 })
      .then((data) => {
        setCars((data.cars || []).filter((car) => compare.includes(car.slug || car._id || car.sourceId)));
      })
      .catch((apiError) => setError(apiError.response?.data?.message || apiError.message))
      .finally(() => setLoading(false));
  }, [compare]);

  return (
    <section className="container py-5">
      <h1 className="section-title">Compare Cars</h1>
      <p className="text-slate-600">Compare selected cars from live backend data.</p>
      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? (
        <div className="premium-card rounded-lg p-5 text-center">Loading comparison...</div>
      ) : cars.length ? (
        <div className="table-responsive premium-card rounded-lg p-3">
          <table className="table align-middle mb-0">
            <thead>
              <tr><th>Car</th><th>Price</th><th>Fuel</th><th>Transmission</th><th>Mileage</th><th /></tr>
            </thead>
            <tbody>
              {cars.map((car) => {
                const carId = car.slug || car._id || car.sourceId;
                return (
                  <tr key={carId}>
                    <td className="fw-bold">{car.brand} {car.model}</td>
                    <td>{formatLakhs(car.price_in_lakhs)}</td>
                    <td>{car.fuel_type}</td>
                    <td>{car.transmission}</td>
                    <td>{car.mileage_kmpl} km/l</td>
                    <td><Link className="btn btn-sm btn-dark" to={`/cars/${carId}`}>Details</Link></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="premium-card rounded-lg p-5 text-center">No cars selected for comparison yet.</div>
      )}
    </section>
  );
};

export default Compare;
