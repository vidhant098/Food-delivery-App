import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';

function Cart({ cartItems, cartCount, onUpdateQuantity }) {
  const totalPrice = useMemo(
    () => cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
    [cartItems]
  );

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 rounded-[2rem] border border-orange-100 bg-white p-6 shadow-[0_20px_80px_rgba(251,146,60,0.12)] sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">Your Order</p>
            <h1 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">View Cart</h1>
            <p className="mt-2 text-sm text-slate-500">
              {cartCount} item{cartCount === 1 ? '' : 's'} added to your cart.
            </p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Continue Shopping
          </Link>
        </div>
      </div>

      {cartItems.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
          <ShoppingCart className="mx-auto h-12 w-12 text-slate-300" />
          <h2 className="mt-4 text-2xl font-bold text-slate-900">Your cart is empty</h2>
          <p className="mt-2 text-slate-500">Add some meals from the menu and they will appear here.</p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="space-y-4">
            {cartItems.map((item) => (
              <article
                key={item.id}
                className="flex flex-col gap-4 rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-28 w-full rounded-[1.5rem] object-cover sm:w-32"
                />

                <div className="flex-1">
                  <h2 className="text-xl font-bold text-slate-900">{item.name}</h2>
                  <p className="mt-1 text-sm text-slate-500">Ready in {item.prepTimeMinutes} minutes</p>
                  <p className="mt-2 text-base font-semibold text-orange-600">${item.price}</p>
                </div>

                <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                  <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 p-1">
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      className="rounded-full p-2 text-slate-700 transition hover:bg-white"
                      aria-label={`Decrease quantity for ${item.name}`}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="min-w-8 text-center text-sm font-semibold text-slate-900">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="rounded-full p-2 text-slate-700 transition hover:bg-white"
                      aria-label={`Increase quantity for ${item.name}`}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(item.id, 0)}
                    className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>

          <aside className="h-fit rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900">Order Summary</h3>
            <div className="mt-6 space-y-4 text-sm text-slate-600">
              <div className="flex items-center justify-between">
                <span>Items</span>
                <span>{cartCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Delivery</span>
                <span>$10</span>
              </div>
              <div className="flex items-center justify-between border-t border-dashed border-slate-200 pt-4 text-base font-bold text-slate-900">
                <span>Total</span>
                <span>${totalPrice + 10}</span>
              </div>
            </div>

            <button
              type="button"
              className="mt-6 w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Checkout
            </button>
          </aside>
        </div>
      )}
    </main>
  );
}

export default Cart;
