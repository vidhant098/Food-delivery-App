import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Clock3, Search, ShoppingBag, Star } from 'lucide-react';
import { FaInstagram, FaLinkedin } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import SlideShow from './SlideShow';

const filterButtons = [
  { id: 'all', label: 'All Items' },
  { id: 'lunch', label: 'Lunch' },
  { id: 'dinner', label: 'Dinner' },
  { id: 'fast', label: 'Fast Delivery' },
  { id: 'top-rated', label: 'Top Rated' },
  { id: 'low-rated', label: 'Low Rated' },
];

function Api({ cartItems, cartCount, onAddToCart }) {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [isSuggestionOpen, setIsSuggestionOpen] = useState(false);
  const recipeRefs = useRef({});
  const resultsSectionRef = useRef(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch('https://dummyjson.com/recipes');
        const data = await response.json();
        setRecipes(data.recipes || []);
      } catch (error) {
        console.error('Failed to fetch recipes', error);
      }
    };

    fetchRecipes();
  }, []);

  const filteredRecipes = useMemo(() => {
    let nextRecipes = [...recipes];

    if (activeFilter === 'lunch') {
      nextRecipes = nextRecipes.filter((item) => item.mealType?.includes('Lunch'));
    }

    if (activeFilter === 'dinner') {
      nextRecipes = nextRecipes.filter((item) => item.mealType?.includes('Dinner'));
    }

    if (activeFilter === 'fast') {
      nextRecipes = nextRecipes.sort((a, b) => a.prepTimeMinutes - b.prepTimeMinutes);
    }

    if (activeFilter === 'top-rated') {
      nextRecipes = nextRecipes.sort((a, b) => b.rating - a.rating);
    }

    if (activeFilter === 'low-rated') {
      nextRecipes = nextRecipes.sort((a, b) => a.rating - b.rating);
    }

    if (search.trim()) {
      const term = search.toLowerCase();
      nextRecipes = nextRecipes.filter((item) => item.name.toLowerCase().includes(term));
    }

    return nextRecipes;
  }, [activeFilter, recipes, search]);

  const searchSuggestions = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return [];
    }

    return recipes
      .filter((item) => item.name.toLowerCase().includes(term))
      .slice(0, 6);
  }, [recipes, search]);

  const cartQuantityById = useMemo(
    () =>
      cartItems.reduce((accumulator, item) => {
        accumulator[item.id] = item.quantity;
        return accumulator;
      }, {}),
    [cartItems]
  );

  const scrollToRecipe = (recipeId) => {
    const recipeElement = recipeRefs.current[recipeId];

    if (recipeElement) {
      recipeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleSuggestionClick = (recipe) => {
    setActiveFilter('all');
    setSearch(recipe.name);
    setIsSuggestionOpen(false);

    requestAnimationFrame(() => {
      resultsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => scrollToRecipe(recipe.id), 250);
    });
  };

  return (
    <main className="pb-12">
      <section className="mx-auto max-w-7xl px-4 pb-8 pt-6 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-orange-100 bg-gradient-to-br from-white via-orange-50/50 to-amber-50 shadow-[0_20px_80px_rgba(251,146,60,0.15)]">
          <div className="grid gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-10 lg:py-10">
            <div className="space-y-6">
              <div className="inline-flex items-center rounded-full border border-orange-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-orange-700 shadow-sm">
                Fresh meals delivered with care
              </div>
              <div className="space-y-4">
                <h1 className="max-w-2xl text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-[2.8rem]">
                  Discover fast, tasty food made for busy days.
                </h1>
                <p className="max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
                  Search recipes, filter by meal type, and browse a cleaner mobile-friendly menu with up to three food cards in each desktop row.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                  <label className="flex items-center gap-3 rounded-2xl border border-orange-200 bg-white px-4 py-3 shadow-sm transition focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100">
                    <Search className="h-5 w-5 text-orange-400" />
                    <input
                      type="text"
                      value={search}
                      onFocus={() => setIsSuggestionOpen(true)}
                      onChange={(event) => {
                        setSearch(event.target.value);
                        setIsSuggestionOpen(true);
                      }}
                      placeholder="Search food items..."
                      className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                    />
                  </label>

                  {isSuggestionOpen && searchSuggestions.length > 0 && (
                    <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-xl">
                      {searchSuggestions.map((recipe) => (
                        <button
                          key={recipe.id}
                          type="button"
                          onMouseDown={() => handleSuggestionClick(recipe)}
                          className="flex w-full items-center justify-between border-b border-slate-100 px-4 py-3 text-left transition last:border-b-0 hover:bg-orange-50"
                        >
                          <span>
                            <span className="block text-sm font-semibold text-slate-900">{recipe.name}</span>
                            <span className="block text-xs text-slate-500">
                              {(recipe.mealType || []).join(', ')}
                            </span>
                          </span>
                          <span className="text-xs font-semibold text-orange-600">View</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => resultsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                  className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:from-orange-600 hover:to-red-500"
                >
                  Explore Menu
                </button>
                <Link
                  to="/cart"
                  className="inline-flex items-center justify-center rounded-2xl border border-orange-200 bg-white px-6 py-3 text-sm font-semibold text-orange-700 shadow-sm transition hover:border-orange-300 hover:bg-orange-50"
                >
                  View Cart
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-orange-50 p-4">
                  <p className="text-sm text-slate-500">Recipes</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">{recipes.length}</p>
                </div>
                <div className="rounded-2xl bg-amber-50 p-4">
                  <p className="text-sm text-slate-500">Cart items</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">{cartCount}</p>
                </div>
                <div className="rounded-2xl bg-rose-50 p-4 col-span-2 sm:col-span-1">
                  <p className="text-sm text-slate-500">Popular filter</p>
                  <p className="mt-1 text-lg font-bold text-slate-900">Fast Delivery</p>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-[1.75rem] border border-slate-100 bg-slate-100 shadow-inner">
              <SlideShow />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-slate-200 bg-white px-4 py-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Browse the menu</h2>
              <p className="mt-1 text-sm text-slate-500">
                Filter meals quickly and keep the layout clean across phone, tablet, and desktop.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {filterButtons.map((button) => {
                const isActive = activeFilter === button.id;

                return (
                  <button
                    key={button.id}
                    type="button"
                    onClick={() => setActiveFilter(button.id)}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      isActive
                        ? 'border-slate-900 bg-slate-900 text-white shadow-lg'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-orange-300 hover:text-orange-600'
                    }`}
                  >
                    {button.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section ref={resultsSectionRef} className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        {filteredRecipes.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white px-6 py-16 text-center text-slate-500">
            No food items matched your search. Try another filter or keyword.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredRecipes.map((item) => (
              <article
                key={item.id}
                ref={(element) => {
                  recipeRefs.current[item.id] = element;
                }}
                className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_16px_50px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(249,115,22,0.16)]"
              >
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-slate-900 shadow">
                    ${item.ingredients.length * 50}
                  </div>
                </div>

                <div className="space-y-5 p-5">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-xl font-bold text-slate-900">{item.name}</h3>
                      <div className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700">
                        <Star className="h-4 w-4 fill-current" />
                        {item.rating}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 text-sm">
                      {(item.mealType || []).map((meal) => (
                        <span
                          key={`${item.id}-${meal}`}
                          className="rounded-full bg-orange-50 px-3 py-1 font-medium text-orange-700"
                        >
                          {meal}
                        </span>
                      ))}
                    </div>

                    <p className="flex items-center gap-2 text-sm font-medium text-emerald-600">
                      <Clock3 className="h-4 w-4" />
                      Ready in {item.prepTimeMinutes} minutes
                    </p>
                  </div>

                  <div>
                    <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
                      Ingredients
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {item.ingredients.slice(0, 4).map((ingredient) => (
                        <span
                          key={`${item.id}-${ingredient}`}
                          className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                        >
                          {ingredient}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => onAddToCart(item)}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      {cartQuantityById[item.id] > 0
                        ? `Added ${cartQuantityById[item.id]}`
                        : 'Add to Cart'}
                    </button>
                    <button
                      type="button"
                      className="flex-1 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-700 transition hover:border-orange-300 hover:bg-orange-100"
                    >
                      Order Now
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <footer className="mx-auto mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] bg-slate-900 px-6 py-10 text-slate-200 shadow-[0_20px_60px_rgba(15,23,42,0.2)] sm:px-10">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.9fr]">
            <div>
              <h4 className="text-2xl font-bold text-white">Thank you for visiting ANiT Food</h4>
              <p className="mt-3 max-w-md text-sm leading-6 text-slate-300">
                Fresh food, smart filters, and a smoother ordering experience built for mobile and desktop users.
              </p>
              <div className="mt-6 flex items-center gap-5">
                <a
                  href="https://www.instagram.com/vidhant_shrivas/"
                  className="rounded-full bg-white/10 p-3 transition hover:bg-white/20"
                >
                  <FaInstagram className="h-5 w-5" />
                </a>
                <a
                  href="https://www.linkedin.com/in/vidhant-shriwas-9a579730b/"
                  className="rounded-full bg-white/10 p-3 transition hover:bg-white/20"
                >
                  <FaLinkedin className="h-5 w-5" />
                </a>
              </div>
            </div>

            <div>
              <h5 className="text-lg font-semibold text-white">Contact</h5>
              <div className="mt-4 space-y-3 text-sm text-slate-300">
                <p>Mail: vidhantshrivas1@gmail.com</p>
                <p>Phone: 9340638455</p>
                <p>Address: IT Park, Jabalpur, Madhya Pradesh</p>
                <p>Support chat: Available inside the app</p>
              </div>
            </div>

            <div>
              <h5 className="text-lg font-semibold text-white">Service Hours</h5>
              <div className="mt-4 space-y-3 text-sm text-slate-300">
                <p>Monday - Friday: 9:00 AM - 11:00 PM</p>
                <p>Saturday: 10:00 AM - 11:30 PM</p>
                <p>Sunday: 10:00 AM - 10:00 PM</p>
                <p>Fast delivery available in selected areas.</p>
              </div>
            </div>

            <div>
              <h5 className="text-lg font-semibold text-white">Quick Info</h5>
              <div className="mt-4 space-y-3 text-sm text-slate-300">
                <p>Popular meals updated daily</p>
                <p>Simple search and meal filtering</p>
                <p>Cart quantity updates in real time</p>
                <p>Safe and easy ordering flow</p>
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-white/10 pt-6 text-center text-sm text-slate-400">
            <p>© 2026 ANiT Food. All rights reserved.</p>
            <p className="mt-2">Made to serve good food with a better browsing experience.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default Api;
