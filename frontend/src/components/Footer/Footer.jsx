import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="mt-5 bg-slate-950 text-white">
    <div className="container py-5">
      <div className="row g-4">
        <div className="col-lg-5">
          <h3 className="fw-black">BAVH Motors AI</h3>
          <p className="mt-3 text-slate-300">A production-ready frontend shell for car discovery, comparison, reviews, and future AI car advisor workflows.</p>
        </div>
        <div className="col-6 col-lg-2">
          <h6 className="text-uppercase text-slate-400">Explore</h6>
          <ul className="list-unstyled vstack gap-2">
            <li><Link to="/new-cars">New Cars</Link></li>
            <li><Link to="/used-cars">Used Cars</Link></li>
            <li><Link to="/reviews">Reviews</Link></li>
          </ul>
        </div>
        <div className="col-6 col-lg-2">
          <h6 className="text-uppercase text-slate-400">Account</h6>
          <ul className="list-unstyled vstack gap-2">
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/wishlist">Wishlist</Link></li>
          </ul>
        </div>
        <div className="col-lg-3">
          <h6 className="text-uppercase text-slate-400">Coverage</h6>
          <p className="text-slate-300">Mumbai, Delhi, Bengaluru, Chennai, Pune, Hyderabad, Kochi.</p>
        </div>
      </div>
      <div className="mt-4 border-top border-slate-800 pt-4 text-sm text-slate-400">© 2026 BAVH Motors AI. Frontend only.</div>
    </div>
  </footer>
);

export default Footer;
