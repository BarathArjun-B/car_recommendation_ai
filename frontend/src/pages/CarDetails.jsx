import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import CarCard from '../components/CarCard/CarCard.jsx';
import Loader from '../components/Loader/Loader.jsx';
import ReviewCard from '../components/ReviewCard/ReviewCard.jsx';
import { reviewsData } from '../data/carsData.js';
import { fetchCarById, fetchCars } from '../services/carApi.js';
import { calculateEmi, formatKm, formatLakhs, formatPrice } from '../utils/helpers.js';

const CarDetails = () => {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downPayment, setDownPayment] = useState(300000);
  const [rate, setRate] = useState(9.5);
  const [months, setMonths] = useState(60);
  const [activeImage, setActiveImage] = useState('');

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError('');

    fetchCarById(id)
      .then((data) => {
        if (!mounted) return;
        setCar(data.car);
        setActiveImage(data.car.image_url);
        return fetchCars({ brand: data.car.brand, limit: 3 });
      })
      .then((data) => {
        if (!mounted || !data) return;
        setSimilar((data.cars || []).filter((item) => (item.slug || item._id || item.sourceId) !== id));
      })
      .catch((apiError) => {
        if (mounted) setError(apiError.response?.data?.message || apiError.message || 'Unable to load car details');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [id]);

  const gallery = useMemo(
    () =>
      car
        ? [
            car.image_url,
            'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1400&q=85',
            'https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1400&q=85',
          ]
        : [],
    [car],
  );

  const emi = useMemo(
    () => (car ? calculateEmi(Math.max(car.price_in_lakhs * 100000 - downPayment, 0), rate, months) : 0),
    [car, downPayment, rate, months],
  );

  if (loading) return <Loader />;

  if (error || !car) {
    return (
      <section className="container py-5 text-center">
        <h1 className="section-title">Car not found</h1>
        <p className="text-slate-600">{error}</p>
        <Link className="btn btn-brand mt-3" to="/new-cars">Browse Cars</Link>
      </section>
    );
  }

  const title = `${car.brand} ${car.model}`;
  const features = car.features?.length
    ? car.features
    : ['Verified listing', 'Service history support', 'EMI guidance', 'Insurance assistance', 'Future AI advisor ready'];

  return (
    <section className="container py-5">
      <div className="row g-4">
        <div className="col-lg-7">
          <div className="premium-card overflow-hidden rounded-lg">
            <img className="h-[430px] w-full object-cover" src={activeImage || car.image_url} alt={title} />
            <div className="grid grid-cols-3 gap-2 p-3">
              {gallery.map((image) => (
                <button className="overflow-hidden rounded border-0 p-0" type="button" key={image} onClick={() => setActiveImage(image)}>
                  <img className="h-24 w-full object-cover" src={image} alt={`${title} gallery`} />
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="col-lg-5">
          <div className="premium-card h-100 rounded-lg p-4">
            <span className="badge bg-danger">{car.condition === 'new' ? 'New Car' : 'Used Car'}</span>
            <h1 className="mt-3 text-4xl font-black">{title}</h1>
            <p className="text-slate-600">
              Live backend listing prepared for AI recommendations, comparison assistance, and personalization.
            </p>
            <div className="my-4 text-3xl font-black text-danger">{formatLakhs(car.price_in_lakhs)}</div>
            <div className="row g-3">
              {[
                ['Fuel', car.fuel_type],
                ['Transmission', car.transmission],
                ['Mileage', `${car.mileage_kmpl} km/l`],
                ['Year', car.year],
                ['Owners', car.ownerCount],
                ['Driven', formatKm(car.kilometersDriven)],
              ].map(([label, value]) => (
                <div className="col-6" key={label}>
                  <div className="rounded bg-slate-100 p-3">
                    <div className="text-xs uppercase text-slate-500">{label}</div>
                    <div className="font-bold">{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mt-1">
        <div className="col-lg-8">
          <div className="premium-card rounded-lg p-4">
            <h2 className="section-title mb-3">Specifications & Features</h2>
            <div className="row g-3">
              {features.map((feature) => (
                <div className="col-md-6" key={feature}>
                  <div className="rounded bg-slate-100 p-3 fw-bold">{feature}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="premium-card rounded-lg p-4">
            <h2 className="text-2xl font-black">EMI Calculator</h2>
            <div className="vstack gap-3 mt-3">
              <input className="form-control" type="number" value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value))} />
              <input className="form-control" type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} />
              <select className="form-select" value={months} onChange={(e) => setMonths(Number(e.target.value))}>
                <option value={36}>36 months</option>
                <option value={48}>48 months</option>
                <option value={60}>60 months</option>
                <option value={84}>84 months</option>
              </select>
              <div className="rounded bg-slate-950 p-3 text-white">
                <div className="text-sm text-slate-300">Estimated EMI</div>
                <div className="text-2xl font-black">{formatPrice(emi)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="mt-5">
        <h2 className="section-title mb-4">Reviews</h2>
        <div className="row g-4">
          {reviewsData.slice(0, 2).map((review) => (
            <div className="col-md-6" key={review.id}><ReviewCard review={review} /></div>
          ))}
        </div>
      </section>

      <section className="mt-5">
        <h2 className="section-title mb-4">Similar Cars</h2>
        <div className="row g-4">
          {similar.map((item) => (
            <div className="col-md-6 col-xl-4" key={item._id || item.slug || item.sourceId}><CarCard car={item} /></div>
          ))}
        </div>
      </section>
    </section>
  );
};

export default CarDetails;
