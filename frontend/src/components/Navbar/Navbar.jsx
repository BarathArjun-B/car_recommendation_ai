import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { getInitials } from '../../utils/helpers.js';

const navItems = [
  { label: 'Explore', path: '/' },
  { label: 'New Cars', path: '/new-cars' },
  { label: 'Used Cars', path: '/used-cars' },
  { label: 'Reviews', path: '/reviews' },
  { label: 'Wishlist', path: '/wishlist' },
];

const linkClass = ({ isActive }) =>
  [
    'group relative rounded-full px-4 py-2 text-sm font-semibold tracking-wide transition duration-200',
    'after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-0 after:-translate-x-1/2 after:rounded-full after:bg-red-600 after:transition-all after:duration-200',
    'hover:bg-white hover:text-black hover:shadow-sm hover:after:w-7',
    isActive ? 'bg-white text-black shadow-md after:w-7' : 'text-gray-700',
  ].join(' ');

const mobileLinkClass = ({ isActive }) =>
  [
    'flex items-center justify-between rounded-lg px-4 py-3 text-sm font-semibold transition',
    isActive ? 'bg-white text-black shadow-md' : 'text-gray-800 hover:bg-white hover:text-black',
  ].join(' ');

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef(null);

  useEffect(() => {
    const closeAccount = (event) => {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setAccountOpen(false);
      }
    };

    document.addEventListener('mousedown', closeAccount);
    return () => document.removeEventListener('mousedown', closeAccount);
  }, []);

  const closeMenus = () => {
    setMobileOpen(false);
    setAccountOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenus();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/88 text-gray-900 shadow-lg shadow-slate-900/8 backdrop-blur-xl">
      <nav className="container mx-auto px-3 py-3 md:px-4">
        <div className="flex items-center justify-between gap-4">
          <Link className="flex items-center gap-3" to="/" onClick={closeMenus}>
            <span className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-lg bg-slate-950 text-sm font-black text-white shadow-lg">
              BM
              <span className="absolute bottom-0 h-1 w-full bg-danger" />
            </span>
            <span className="leading-tight">
              <span className="block text-base font-black tracking-wide text-slate-950">BAVH Motors AI</span>
              <span className="hidden text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 sm:block">
                Smart car guide
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <NavLink className={linkClass} to={item.path} key={item.path}>
                {item.label}
              </NavLink>
            ))}

            <div className="relative" ref={accountRef}>
              <button
                className="relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-gray-700 transition after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-0 after:-translate-x-1/2 after:rounded-full after:bg-red-600 after:transition-all hover:bg-white hover:text-black hover:shadow-sm hover:after:w-7"
                type="button"
                onClick={() => setAccountOpen((open) => !open)}
                aria-expanded={accountOpen}
              >
                <span>Account</span>
                <span className={`transition ${accountOpen ? 'rotate-180' : ''}`}>⌄</span>
              </button>

              {accountOpen && (
                <div className="absolute right-0 mt-3 w-56 overflow-hidden rounded-lg border border-slate-200 bg-white/95 p-2 shadow-2xl shadow-slate-900/15 backdrop-blur-xl">
                  <NavLink className="block rounded px-3 py-2 text-sm font-semibold text-gray-800 transition hover:bg-slate-100 hover:text-black" to="/account" onClick={closeMenus}>
                    Profile
                  </NavLink>
                  <NavLink className="block rounded px-3 py-2 text-sm font-semibold text-gray-800 transition hover:bg-slate-100 hover:text-black" to="/wishlist" onClick={closeMenus}>
                    Wishlist
                  </NavLink>
                  <NavLink className="block rounded px-3 py-2 text-sm font-semibold text-gray-800 transition hover:bg-slate-100 hover:text-black" to="/compare" onClick={closeMenus}>
                    Compare
                  </NavLink>
                  {isAuthenticated && (
                    <button className="mt-1 block w-full rounded px-3 py-2 text-left text-sm font-semibold text-red-700 transition hover:bg-red-50" type="button" onClick={handleLogout}>
                      Logout
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="hidden items-center gap-2 lg:flex">
            {isAuthenticated ? (
              <NavLink className="flex items-center gap-2 rounded-full bg-slate-950 px-3 py-2 text-sm font-black text-white shadow-md transition hover:-translate-y-0.5 hover:bg-black" to="/account">
                <span className="rounded bg-danger px-2 py-1 text-xs text-white">{getInitials(user.name)}</span>
                {user.name}
              </NavLink>
            ) : (
              <>
                <NavLink className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 transition hover:border-slate-950 hover:text-black hover:shadow-sm" to="/login">
                  Login
                </NavLink>
                <NavLink className="rounded-full bg-danger px-4 py-2 text-sm font-bold text-white shadow-lg shadow-red-900/30 transition hover:-translate-y-0.5 hover:bg-red-700" to="/register">
                  Register
                </NavLink>
              </>
            )}
          </div>

          <button
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-slate-300 text-slate-950 transition hover:bg-slate-100 lg:hidden"
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
          >
            <span className="relative h-5 w-6">
              <span className={`absolute left-0 top-0 h-0.5 w-6 rounded bg-slate-950 transition ${mobileOpen ? 'top-2 rotate-45' : ''}`} />
              <span className={`absolute left-0 top-2 h-0.5 w-6 rounded bg-slate-950 transition ${mobileOpen ? 'opacity-0' : ''}`} />
              <span className={`absolute left-0 top-4 h-0.5 w-6 rounded bg-slate-950 transition ${mobileOpen ? 'top-2 -rotate-45' : ''}`} />
            </span>
          </button>
        </div>

        <div className={`grid transition-all duration-300 lg:hidden ${mobileOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
          <div className="overflow-hidden">
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50/95 p-2 shadow-xl">
              <div className="grid gap-1">
                {navItems.map((item) => (
                  <NavLink className={mobileLinkClass} to={item.path} key={item.path} onClick={closeMenus}>
                    {item.label}
                    <span>›</span>
                  </NavLink>
                ))}
                <NavLink className={mobileLinkClass} to="/account" onClick={closeMenus}>
                  Account
                  <span>›</span>
                </NavLink>
              </div>

              <div className="mt-3 grid gap-2 border-t border-slate-200 pt-3">
                {isAuthenticated ? (
                  <button className="rounded-lg bg-red-600 px-4 py-3 text-sm font-black text-white" type="button" onClick={handleLogout}>
                    Logout
                  </button>
                ) : (
                  <>
                    <NavLink className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-center text-sm font-black text-gray-800" to="/login" onClick={closeMenus}>
                      Login
                    </NavLink>
                    <NavLink className="rounded-lg bg-danger px-4 py-3 text-center text-sm font-black text-white" to="/register" onClick={closeMenus}>
                      Register
                    </NavLink>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
