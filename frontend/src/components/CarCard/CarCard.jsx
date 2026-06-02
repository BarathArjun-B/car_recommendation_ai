import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { formatKm, formatLakhs, formatPrice } from '../../utils/helpers.js';

const CarCard = React.memo(({ car }) => {
  const { wishlist, compare, toggleWishlist, toggleCompare } = useAuth();
  const carId = car.id || car.slug || car._id || car.sourceId;
  const wished = wishlist.includes(carId);
  const comparing = compare.includes(carId);
  const image = car.image_url || car.image;
  const title = car.model ? `${car.brand} ${car.model}` : car.title;
  const price = car.price_in_lakhs ? formatLakhs(car.price_in_lakhs) : formatPrice(car.price);
  const fuelType = car.fuel_type || car.fuelType;
  const mileage = car.mileage_kmpl ? `${car.mileage_kmpl} km/l` : car.mileage;
  const condition = car.condition || car.type;
  const ownerCount = car.ownerCount ?? 0;
  const kilometersDriven = car.kilometersDriven ?? car.drivenKm ?? 0;
  const rating = car.rating || 4.5;
  const location = car.location || 'India';

  return (
    <article className="premium-card hover-lift h-100 overflow-hidden rounded-lg">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img className="h-full w-full object-cover" src={image} alt={title} loading="lazy" />
        <span className="badge bg-dark position-absolute start-0 top-0 m-3">{car.year}</span>
        <span className="badge bg-danger position-absolute end-0 top-0 m-3">{rating} ★</span>
      </div>
      <div className="p-4">
        <h3 className="text-xl font-black">{title}</h3>
        <p className="text-sm text-slate-500">{car.brand} · {location}</p>
        <div className="mb-3 text-2xl font-black text-danger">{price}</div>
        <div className="mb-3 grid grid-cols-3 gap-2 text-center text-sm">
          <span className="rounded bg-slate-100 px-2 py-2">{fuelType}</span>
          <span className="rounded bg-slate-100 px-2 py-2">{car.transmission}</span>
          <span className="rounded bg-slate-100 px-2 py-2">{mileage}</span>
        </div>
        {condition === 'used' && (
          <div className="mb-3 rounded bg-amber-50 px-3 py-2 text-sm text-amber-900">
            {ownerCount} owner · {formatKm(kilometersDriven)}
          </div>
        )}
        <div className="d-grid gap-2">
          <Link className="btn btn-dark fw-bold" to={`/cars/${carId}`}>View Details</Link>
          <div className="btn-group">
            <button className={`btn ${wished ? 'btn-danger' : 'btn-outline-danger'}`} type="button" onClick={() => toggleWishlist(carId)}>
              {wished ? 'Saved' : 'Wishlist'}
            </button>
            <button className={`btn ${comparing ? 'btn-secondary' : 'btn-outline-secondary'}`} type="button" onClick={() => toggleCompare(carId)}>
              {comparing ? 'Added' : 'Compare'}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
});

CarCard.displayName = 'CarCard';

export default CarCard;
