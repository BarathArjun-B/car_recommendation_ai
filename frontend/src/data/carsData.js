export const brands = ['BMW', 'Audi', 'Mercedes', 'Tata', 'Mahindra', 'Hyundai', 'Kia'];

const galleries = [
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=85',
  'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1400&q=85',
  'https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1400&q=85',
];

export const carsData = [
  ['bmw-x5', 'BMW X5 xDrive40i', 'BMW', 'new', 9700000, '12 km/l', 'Petrol', 'Automatic', 2025, 0, 0, 'Mumbai', 'Luxury SUV with confident performance and a plush cabin.', 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=85'],
  ['bmw-3-series', 'BMW 3 Series 330i M Sport', 'BMW', 'used', 4280000, '16 km/l', 'Petrol', 'Automatic', 2022, 1, 22000, 'Mumbai', 'Driver-focused sedan with strong service history.', 'https://images.unsplash.com/photo-1556189250-72ba954cfc2b?auto=format&fit=crop&w=1200&q=85'],
  ['bmw-i4', 'BMW i4 eDrive40', 'BMW', 'new', 7250000, '590 km range', 'Electric', 'Automatic', 2025, 0, 0, 'Delhi', 'Premium electric sedan with grand touring range.', 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&w=1200&q=85'],
  ['audi-q7', 'Audi Q7 Technology', 'Audi', 'new', 8850000, '11 km/l', 'Petrol', 'Automatic', 2025, 0, 0, 'Delhi', 'Seven-seat luxury SUV with quattro poise.', 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=1200&q=85'],
  ['audi-a4', 'Audi A4 Premium Plus', 'Audi', 'used', 3590000, '17 km/l', 'Petrol', 'Automatic', 2021, 1, 31000, 'Bengaluru', 'Quiet executive sedan with understated premium appeal.', 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&w=1200&q=85'],
  ['audi-etron', 'Audi e-tron 55 Quattro', 'Audi', 'used', 5850000, '484 km range', 'Electric', 'Automatic', 2022, 1, 19000, 'Hyderabad', 'Luxury EV with quattro traction and refined ride.', 'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?auto=format&fit=crop&w=1200&q=85'],
  ['mercedes-glc', 'Mercedes-Benz GLC 300', 'Mercedes', 'new', 7600000, '14 km/l', 'Petrol', 'Automatic', 2025, 0, 0, 'Chennai', 'Comfort-first luxury SUV with rich cabin ambience.', 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=85'],
  ['mercedes-c-class', 'Mercedes-Benz C-Class C220d', 'Mercedes', 'used', 4450000, '20 km/l', 'Diesel', 'Automatic', 2021, 2, 41000, 'Pune', 'Elegant diesel sedan for relaxed long drives.', 'https://images.unsplash.com/photo-1627454820516-dc767bcb4d3f?auto=format&fit=crop&w=1200&q=85'],
  ['mercedes-eqs', 'Mercedes-Benz EQS 580', 'Mercedes', 'used', 11900000, '857 km range', 'Electric', 'Automatic', 2023, 1, 9000, 'Delhi', 'Flagship EV with limousine comfort and huge range.', 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=1200&q=85'],
  ['tata-harrier', 'Tata Harrier Fearless Plus', 'Tata', 'new', 2690000, '16 km/l', 'Diesel', 'Automatic', 2025, 0, 0, 'Pune', 'Bold SUV with strong safety and road presence.', 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=85'],
  ['tata-nexon-ev', 'Tata Nexon EV Max', 'Tata', 'used', 1390000, '437 km range', 'Electric', 'Automatic', 2022, 1, 26000, 'Ahmedabad', 'Practical electric compact SUV with low running costs.', 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1200&q=85'],
  ['tata-safari', 'Tata Safari Accomplished Plus', 'Tata', 'new', 2750000, '16 km/l', 'Diesel', 'Automatic', 2025, 0, 0, 'Nagpur', 'Large three-row SUV with safety-led equipment.', 'https://images.unsplash.com/photo-1549927681-0b673b8243ab?auto=format&fit=crop&w=1200&q=85'],
  ['mahindra-xuv700', 'Mahindra XUV700 AX7L', 'Mahindra', 'new', 2850000, '15 km/l', 'Diesel', 'Automatic', 2025, 0, 0, 'Hyderabad', 'Family SUV with ADAS and strong performance.', 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1200&q=85'],
  ['mahindra-thar', 'Mahindra Thar LX 4x4', 'Mahindra', 'used', 1575000, '15 km/l', 'Diesel', 'Manual', 2021, 1, 35000, 'Jaipur', 'Lifestyle 4x4 with rugged enthusiast appeal.', 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=85'],
  ['mahindra-scorpio-n', 'Mahindra Scorpio-N Z8L', 'Mahindra', 'new', 2460000, '15 km/l', 'Diesel', 'Automatic', 2025, 0, 0, 'Lucknow', 'Tough body-on-frame SUV with premium upgrades.', 'https://images.unsplash.com/photo-1511527844068-006b95d162c2?auto=format&fit=crop&w=1200&q=85'],
  ['hyundai-creta', 'Hyundai Creta SX(O)', 'Hyundai', 'new', 2020000, '18 km/l', 'Petrol', 'Automatic', 2025, 0, 0, 'Chennai', 'Feature-rich compact SUV with high buyer trust.', 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=1200&q=85'],
  ['hyundai-verna', 'Hyundai Verna SX Turbo', 'Hyundai', 'used', 1320000, '19 km/l', 'Petrol', 'DCT', 2023, 1, 18000, 'Kochi', 'Quick sedan with modern tech and low mileage.', 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&w=1200&q=85'],
  ['hyundai-ioniq-5', 'Hyundai Ioniq 5', 'Hyundai', 'new', 4600000, '631 km range', 'Electric', 'Automatic', 2025, 0, 0, 'Gurugram', 'Futuristic EV crossover with lounge-like space.', 'https://images.unsplash.com/photo-1617886322168-72b886573c53?auto=format&fit=crop&w=1200&q=85'],
  ['kia-seltos', 'Kia Seltos X-Line', 'Kia', 'new', 2100000, '17 km/l', 'Petrol', 'DCT', 2025, 0, 0, 'Kochi', 'Sporty compact SUV with connected features.', 'https://images.unsplash.com/photo-1603386329225-868f9b1ee6c9?auto=format&fit=crop&w=1200&q=85'],
  ['kia-carens', 'Kia Carens Luxury Plus', 'Kia', 'used', 1680000, '21 km/l', 'Diesel', 'Automatic', 2022, 1, 24000, 'Ahmedabad', 'Flexible three-row family car with efficient diesel.', 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=85'],
  ['kia-ev6', 'Kia EV6 GT Line', 'Kia', 'new', 6095000, '708 km range', 'Electric', 'Automatic', 2025, 0, 0, 'Mumbai', 'Premium EV crossover with long range and fast charging.', 'https://images.unsplash.com/photo-1597007030739-6d2e7172ee1f?auto=format&fit=crop&w=1200&q=85'],
].map(([id, title, brand, type, price, mileage, fuelType, transmission, year, ownerCount, kilometersDriven, location, overview, image], index) => ({
  id,
  title,
  brand,
  type,
  price,
  mileage,
  fuelType,
  transmission,
  year,
  ownerCount,
  kilometersDriven,
  location,
  overview,
  image,
  gallery: [image, ...galleries].slice(0, 3),
  rating: Number((4.2 + (index % 7) * 0.1).toFixed(1)),
  features: ['Verified listing', 'Service history', 'Insurance support', 'EMI assistance', 'Test drive ready'],
}));

export const reviewsData = [
  {
    id: 'luxury-suv-guide',
    title: 'Luxury SUVs worth shortlisting in 2026',
    category: 'Featured Review',
    excerpt: 'A practical guide to ride comfort, cabin quality, running costs, and long-term ownership.',
    image: 'https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1000&q=85',
  },
  {
    id: 'ev-buying',
    title: 'How to choose your first premium EV',
    category: 'Automotive News',
    excerpt: 'Range, charging, battery warranty, and daily usage matter more than headline power figures.',
    image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1000&q=85',
  },
  {
    id: 'used-german-cars',
    title: 'Used German sedans: smart buy or expensive mistake?',
    category: 'Ownership',
    excerpt: 'What to check before buying a used BMW, Audi, or Mercedes in the premium segment.',
    image: 'https://images.unsplash.com/photo-1556189250-72ba954cfc2b?auto=format&fit=crop&w=1000&q=85',
  },
];
