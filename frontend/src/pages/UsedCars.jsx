import { useLiveCars } from '../hooks/useLiveCars.js';
import { CarListingPage } from './NewCars.jsx';

const UsedCars = () => {
  const liveCars = useLiveCars('used');

  return (
    <CarListingPage
      title="Used Cars"
      description="Used listings with owner history and driven kilometers from the backend cars API."
      {...liveCars}
      used
    />
  );
};

export default UsedCars;
