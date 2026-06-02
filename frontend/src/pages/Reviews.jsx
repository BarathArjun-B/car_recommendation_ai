import ReviewCard from '../components/ReviewCard/ReviewCard.jsx';
import { reviewsData } from '../data/carsData.js';

const Reviews = () => (
  <section className="container py-5">
    <h1 className="section-title">Reviews & News</h1>
    <p className="text-slate-600">News cards, car reviews, and automotive articles.</p>
    <div className="premium-card mb-4 overflow-hidden rounded-lg">
      <div className="row g-0 align-items-center">
        <div className="col-lg-6"><img className="h-[360px] w-full object-cover" src="https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1200&q=85" alt="Featured review" /></div>
        <div className="col-lg-6 p-5"><span className="badge bg-danger">Featured</span><h2 className="mt-3 text-4xl font-black">The smarter way to shortlist a car</h2><p className="text-slate-600">Balance price, ownership, resale, comfort, safety, and driving feel before you book a test drive.</p></div>
      </div>
    </div>
    <div className="row g-4">{reviewsData.map((review) => <div className="col-md-4" key={review.id}><ReviewCard review={review} /></div>)}</div>
  </section>
);

export default Reviews;
