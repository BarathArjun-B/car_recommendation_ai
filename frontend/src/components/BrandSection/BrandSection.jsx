import { Link } from 'react-router-dom';
import cars from '../../data/indianCarsDB.json';

const brands = [...new Set(cars.map((car) => car.brand))];

const BrandSection = () => (
  <div className="row g-3">
    {brands.map((brand) => (
      <div className="col-6 col-md-4 col-lg" key={brand}>
        <Link className="premium-card hover-lift d-flex h-100 align-items-center justify-content-center rounded-lg p-4 text-center" to={`/new-cars?brand=${brand}`}>
          <span className="text-xl font-black">{brand}</span>
        </Link>
      </div>
    ))}
  </div>
);

export default BrandSection;
