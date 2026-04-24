import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu, X } from 'lucide-react';

const Navbar = ({ cartCount }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;
  const navLinkClass = (path) =>
    `rounded-full px-4 py-2 text-sm font-semibold transition ${
      isActive(path)
        ? 'bg-slate-900 text-white shadow-lg'
        : 'text-slate-700 hover:bg-orange-50 hover:text-orange-600'
    }`;

  return (
    <nav className="sticky top-0 z-50 border-b border-orange-100 bg-white/95 px-4 py-4 backdrop-blur md:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-red-500 shadow-lg">
            <span className="text-xl font-black text-white">A</span>
          </div>
          <div>
            <p className="text-lg font-black tracking-tight text-slate-900 sm:text-xl">ANiT Food</p>
            <p className="hidden text-xs font-medium text-slate-500 sm:block">Fresh recipes, faster browsing</p>
          </div>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          <Link to="/" className={navLinkClass('/')}>
            Home
          </Link>
          <Link to="/login" className={navLinkClass('/login')}>
            Login
          </Link>
          <Link to="/register" className={navLinkClass('/register')}>
            Register
          </Link>
          <Link to="/cart" className={navLinkClass('/cart')}>
            View Cart
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600"
          >
            <User size={18} />
            Account
          </Link>
          <Link
            to="/cart"
            className="relative rounded-full border border-slate-200 p-3 text-slate-700 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-2xl border border-slate-200 p-2 text-slate-700 transition hover:border-orange-200 hover:bg-orange-50 md:hidden"
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="mx-auto mt-4 max-w-7xl rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-xl md:hidden">
          <div className="space-y-2">
            <Link to="/" className={`block ${navLinkClass('/')}`} onClick={() => setMobileOpen(false)}>
              Home
            </Link>
            <Link to="/login" className={`block ${navLinkClass('/login')}`} onClick={() => setMobileOpen(false)}>
              Login
            </Link>
            <Link
              to="/register"
              className={`block ${navLinkClass('/register')}`}
              onClick={() => setMobileOpen(false)}
            >
              Register
            </Link>
            <Link
              to="/cart"
              className={`block ${navLinkClass('/cart')}`}
              onClick={() => setMobileOpen(false)}
            >
              View Cart
            </Link>
            <Link
              to="/cart"
              className="flex w-full items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700"
              onClick={() => setMobileOpen(false)}
            >
              <span className="inline-flex items-center gap-2">
                <ShoppingCart size={18} />
                Cart
              </span>
              {cartCount > 0 && (
                <span className="rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
