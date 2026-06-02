import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import CarGrid from '../components/CarGrid/CarGrid.jsx';
import { useLiveCars } from '../hooks/useLiveCars.js';

const NewCars = () => {
  const [params] = useSearchParams();
  const liveCars = useLiveCars('new');

  useEffect(() => {
    liveCars.setFilters((current) => ({
      ...current,
      brand: params.get('brand') || current.brand,
      query: params.get('search') || current.query,
    }));
  }, [params, liveCars.setFilters]);

  return (
    <CarListingPage
      title="New Cars"
      description="Search, filter, and compare latest new cars from the backend cars API."
      {...liveCars}
    />
  );
};

export const CarListingPage = ({
  title,
  description,
  loading,
  error,
  cars,
  filters,
  setFilters,
  metadata,
  page,
  setPage,
  pagination,
  used = false,
}) => {
  const update = (key, value) => {
    setPage(1);
    setFilters((current) => ({ ...current, [key]: value }));
  };

  return (
    <section className="container py-5">
      <h1 className="section-title">{title}</h1>
      <p className="text-slate-600">{description}</p>
      <div className="row g-4">
        <div className="col-lg-3">
          <aside className="premium-card sticky-lg-top rounded-lg p-4" style={{ top: 96 }}>
            <h2 className="text-xl font-black">Filters</h2>
            <div className="vstack gap-3 mt-3">
              <input
                className="form-control"
                value={filters.query}
                onChange={(event) => update('query', event.target.value)}
                placeholder="Search model, fuel, brand"
              />
              <select className="form-select" value={filters.brand} onChange={(event) => update('brand', event.target.value)}>
                {metadata.brands.map((brand) => (
                  <option key={brand}>{brand}</option>
                ))}
              </select>
              <select
                className="form-select"
                value={filters.bodyType}
                onChange={(event) => update('bodyType', event.target.value)}
              >
                {metadata.bodyTypes.map((bodyType) => (
                  <option key={bodyType}>{bodyType}</option>
                ))}
              </select>
              <select
                className="form-select"
                value={filters.fuelType}
                onChange={(event) => update('fuelType', event.target.value)}
              >
                {metadata.fuelTypes.map((fuelType) => (
                  <option key={fuelType}>{fuelType}</option>
                ))}
              </select>
              <select
                className="form-select"
                value={filters.transmission}
                onChange={(event) => update('transmission', event.target.value)}
              >
                {metadata.transmissions.map((transmission) => (
                  <option key={transmission}>{transmission}</option>
                ))}
              </select>
              <input
                className="form-control"
                type="number"
                value={filters.budget}
                onChange={(event) => update('budget', event.target.value)}
                placeholder="Budget in lakh"
              />
              {used && (
                <div className="rounded bg-amber-50 p-3 text-sm text-amber-900">
                  Used cards include owner count and driven kilometers.
                </div>
              )}
            </div>
          </aside>
        </div>
        <div className="col-lg-9">
          <div className="mb-3 d-flex flex-wrap align-items-center justify-content-between gap-2 text-sm font-bold text-slate-500">
            <span>{pagination.total} cars found · source: {pagination.source}</span>
            <span>Page {page} of {pagination.totalPages}</span>
          </div>
          <CarGrid cars={cars} loading={loading} error={error} />
          <div className="mt-4 d-flex justify-content-center gap-2">
            <button
              className="btn btn-outline-dark"
              type="button"
              disabled={page <= 1 || loading}
              onClick={() => setPage((current) => current - 1)}
            >
              Previous
            </button>
            <button
              className="btn btn-dark"
              type="button"
              disabled={page >= pagination.totalPages || loading}
              onClick={() => setPage((current) => current + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewCars;
