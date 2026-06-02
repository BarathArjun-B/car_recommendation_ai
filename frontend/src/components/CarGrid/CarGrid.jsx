import CarCard from '../CarCard/CarCard.jsx';
import Loader from '../Loader/Loader.jsx';

const CarGrid = ({ cars, loading, error, emptyMessage = 'No cars found.' }) => {
  if (loading) return <Loader />;

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!cars.length) {
    return <div className="premium-card rounded-lg p-5 text-center">{emptyMessage}</div>;
  }

  return (
    <div className="row g-4">
      {cars.map((car) => (
        <div className="col-md-6 col-xl-4" key={car.id}>
          <CarCard car={car} />
        </div>
      ))}
    </div>
  );
};

export default CarGrid;
