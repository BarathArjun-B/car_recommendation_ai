import { Link } from 'react-router-dom';

const NotFound = () => (
  <section className="container py-5 text-center">
    <div className="premium-card mx-auto max-w-2xl rounded-lg p-5">
      <span className="badge bg-danger">404</span>
      <h1 className="section-title mt-3">Page not found</h1>
      <p className="text-slate-600">This route does not exist in BAVH Motors AI.</p>
      <Link className="btn btn-brand mt-3" to="/">Back Home</Link>
    </div>
  </section>
);

export default NotFound;
