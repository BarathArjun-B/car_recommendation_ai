import { useAuth } from '../hooks/useAuth.js';
import { getInitials } from '../utils/helpers.js';

const Profile = () => {
  const { user, wishlist, compare } = useAuth();
  return (
    <section className="container py-5">
      <div className="premium-card rounded-lg p-4 p-md-5">
        <div className="d-flex align-items-center gap-4">
          <div className="d-flex h-24 w-24 align-items-center justify-content-center rounded bg-slate-950 text-3xl font-black text-white">{getInitials(user.name)}</div>
          <div><h1 className="section-title mb-1">{user.name}</h1><p className="mb-0 text-slate-600">{user.email}</p></div>
        </div>
        <div className="row g-4 mt-4">
          <div className="col-md-4"><div className="rounded bg-slate-100 p-4"><div className="text-3xl font-black">{wishlist.length}</div><div>Saved cars</div></div></div>
          <div className="col-md-4"><div className="rounded bg-slate-100 p-4"><div className="text-3xl font-black">{compare.length}</div><div>Compare cars</div></div></div>
          <div className="col-md-4"><div className="rounded bg-slate-100 p-4"><div className="text-3xl font-black">AI</div><div>Advisor-ready profile</div></div></div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
