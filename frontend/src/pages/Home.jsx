import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import BrandSection from '../components/BrandSection/BrandSection.jsx';
import CarCard from '../components/CarCard/CarCard.jsx';
import Hero from '../components/Hero/Hero.jsx';
import ReviewCard from '../components/ReviewCard/ReviewCard.jsx';
import SearchBar from '../components/SearchBar/SearchBar.jsx';
import { reviewsData } from '../data/carsData.js';
import { useLiveCars } from '../hooks/useLiveCars.js';

const Home = () => {
  const navigate = useNavigate();
  const { cars, loading } = useLiveCars('all');
  const featured = useMemo(() => cars.filter((car) => car.condition === 'new').slice(0, 4), [cars]);
  const trending = useMemo(() => cars.filter((car) => car.condition === 'used').slice(0, 4), [cars]);
  const search = (query) => navigate(`/new-cars?search=${encodeURIComponent(query)}`);

  return (
    <>
      <Hero onSearch={search} />
      <section className="container py-5">
        <div className="glass-card rounded-lg p-4">
          <div className="row align-items-center g-3">
            <div className="col-lg-4">
              <h2 className="section-title">Search Cars</h2>
              <p className="mb-0 text-slate-600">Find cars by brand, model, fuel type, or city.</p>
            </div>
            <div className="col-lg-8"><SearchBar onSearch={search} /></div>
          </div>
        </div>
      </section>
      <section className="container pb-5">
        <h2 className="section-title mb-4">Featured Cars</h2>
        {loading ? <div className="premium-card rounded-lg p-5 text-center">Loading live car data...</div> : <div className="row g-4">{featured.map((car) => <div className="col-md-6 col-xl-3" key={car._id || car.slug || car.sourceId}><CarCard car={car} /></div>)}</div>}
      </section>
      <section className="bg-white py-5">
        <div className="container">
          <h2 className="section-title mb-4">Popular Brands</h2>
          <BrandSection />
        </div>
      </section>
      <section className="container py-5">
        <h2 className="section-title mb-4">Trending Cars</h2>
        <div className="row g-4">{trending.map((car) => <div className="col-md-6 col-xl-3" key={car._id || car.slug || car.sourceId}><CarCard car={car} /></div>)}</div>
      </section>
      <section className="bg-slate-950 py-5 text-white">
        <div className="container">
          <h2 className="text-3xl font-black">Latest Reviews</h2>
          <p className="text-slate-300">Automotive articles and review cards ready for future CMS integration.</p>
          <div className="row g-4">{reviewsData.map((review) => <div className="col-md-4" key={review.id}><ReviewCard review={review} /></div>)}</div>
        </div>
      </section>
      <section className="container py-5">
        <h2 className="section-title mb-4">Why Choose Us</h2>
        <div className="row g-4">
          {[
            ['AI-ready foundation', 'Prepared for recommendation engine, chatbot, and car advisor services.'],
            ['Buyer-first UX', 'Filters, compare, wishlist, reviews, and car details work together cleanly.'],
            ['Scalable frontend', 'Reusable components, lazy routes, custom hooks, and clean state boundaries.'],
          ].map(([title, text]) => <div className="col-md-4" key={title}><div className="premium-card h-100 rounded-lg p-4"><h3 className="text-xl font-black">{title}</h3><p className="mb-0 text-slate-600">{text}</p></div></div>)}
        </div>
      </section>
    </>
  );
};

export default Home;
