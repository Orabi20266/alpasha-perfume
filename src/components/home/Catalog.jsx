import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import Reveal from '../ui/Reveal';
import { useStore } from '../../store/StoreContext';
import { useUi } from '../../store/UiContext';
import { CATEGORIES, categoryLabel } from '../../data/seed';
import { money } from '../../lib/format';

export default function Catalog() {
  const { products, settings, wishlist } = useStore();
  const { filters, setFilter, resetFilters, maxProductPrice, openCheckout } = useUi();
  const [showFilters, setShowFilters] = useState(false);

  const activeCategory = CATEGORIES.find((c) => c.id === filters.category);

  const filtered = useMemo(() => {
    const query = filters.query.trim().toLowerCase();
    const list = products.filter((product) => {
      const matchCategory =
        filters.category === 'all' || product.category === filters.category;
      const matchPrice = Number(product.price) <= Number(filters.maxPrice);
      const matchQuery =
        !query ||
        [
          product.name,
          product.sku,
          product.description,
          product.badge,
          categoryLabel(product.category),
        ]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query));
      const matchDiscount =
        !filters.discountOnly ||
        (product.oldPrice && product.oldPrice > product.price);
      const matchWishlist =
        !filters.wishlistOnly || wishlist.includes(product.id);

      return (
        matchCategory && matchPrice && matchQuery && matchDiscount && matchWishlist
      );
    });

    if (filters.sort === 'price-asc') list.sort((a, b) => a.price - b.price);
    if (filters.sort === 'price-desc') list.sort((a, b) => b.price - a.price);
    if (filters.sort === 'rating') list.sort((a, b) => b.rating - a.rating);
    if (filters.sort === 'featured') {
      list.sort((a, b) => Number(b.featured) - Number(a.featured));
    }
    return list;
  }, [products, filters, wishlist]);

  const hasFilters =
    filters.category !== 'all' ||
    filters.query ||
    filters.discountOnly ||
    filters.wishlistOnly ||
    Number(filters.maxPrice) < maxProductPrice;

  const extraFilterCount =
    (filters.discountOnly ? 1 : 0) +
    (Number(filters.maxPrice) < maxProductPrice ? 1 : 0);

  const sliderFill = Math.round(
    ((Number(filters.maxPrice) - 100) / Math.max(1, maxProductPrice - 100)) * 100,
  );

  return (
    <main id="catalog" className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2 sm:mb-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 sm:text-2xl">
            منتجات الباشا
          </h1>
          <p className="mt-0.5 text-[11px] text-slate-500 sm:text-xs">
            عطور شرقية وفرنسية فاخرة — الدفع عند الاستلام
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => openCheckout('quote')}
            className="flex items-center gap-1.5 rounded-full border border-pasha-200 bg-white px-3 py-1.5 text-[11px] font-bold text-pasha-700 transition hover:bg-pasha-50"
          >
            <i className="fa-solid fa-file-invoice-dollar text-pasha-500" />
            عرض سعر خاص
          </button>
          <Link
            to="/offers"
            className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-[11px] font-bold text-amber-800 ring-1 ring-amber-200 transition hover:bg-amber-100"
          >
            <i className="fa-solid fa-bolt text-amber-500" />
            عروض الموسم
          </Link>
        </div>
      </div>

      <Reveal className="mb-5 rounded-3xl border border-slate-200/80 bg-white p-4 shadow-card sm:mb-6 sm:p-5">
        <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div
            className="no-scrollbar flex items-center gap-2 overflow-x-auto py-1"
            role="tablist"
            aria-label="أقسام المتجر"
          >
            {CATEGORIES.map((category) => {
              const active = filters.category === category.id;
              return (
                <button
                  key={category.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter('category', category.id)}
                  className={`flex shrink-0 items-center gap-1.5 rounded-2xl px-3 py-2 text-[11px] font-bold transition-all duration-300 sm:gap-2 sm:px-4 sm:py-2.5 sm:text-sm ${
                    active
                      ? 'scale-[1.02] bg-pasha-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-pasha-50 hover:text-pasha-700'
                  }`}
                >
                  <i className={`fa-solid ${category.icon} ${active ? 'text-white' : 'text-pasha-600'}`} />
                  <span>{category.label}</span>
                  {category.id === 'all' && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] ${
                        active ? 'bg-white/20 text-white' : 'bg-white text-pasha-700'
                      }`}
                    >
                      {products.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 sm:gap-4 sm:pt-4">
          <div
            id="catalog-extra-filters"
            className={`${showFilters ? 'flex' : 'hidden'} w-full flex-wrap items-center gap-4 sm:flex sm:gap-6 lg:w-auto`}
          >
            <div className="flex w-full items-center gap-3 rounded-2xl border border-slate-200/70 bg-slate-50 px-4 py-2 sm:w-auto sm:flex-initial">
              <i className="fa-solid fa-sliders text-sm text-pasha-600" />
              <div className="flex w-full flex-col sm:w-48">
                <div className="mb-1 flex justify-between text-xs font-bold text-slate-700">
                  <span>السعر الأقصى:</span>
                  <span className="font-extrabold text-pasha-700">
                    {money(filters.maxPrice, settings.currency)}
                  </span>
                </div>
                <input
                  type="range"
                  min="100"
                  max={maxProductPrice}
                  step="50"
                  value={filters.maxPrice}
                  onChange={(event) => setFilter('maxPrice', Number(event.target.value))}
                  style={{ '--fill': `${Math.max(0, Math.min(100, sliderFill))}%` }}
                  aria-label="أقصى سعر"
                />
              </div>
            </div>

            <label className="inline-flex w-full cursor-pointer select-none items-center justify-center gap-2 rounded-2xl border border-pasha-200/80 bg-pasha-50/70 px-3.5 py-2.5 text-pasha-900 transition hover:bg-pasha-100/70 sm:w-auto sm:justify-start">
              <input
                type="checkbox"
                checked={filters.discountOnly}
                onChange={(event) => setFilter('discountOnly', event.target.checked)}
                className="h-4 w-4 cursor-pointer rounded accent-pasha-600"
              />
              <span className="flex items-center gap-1.5 text-xs font-bold">
                <i className="fa-solid fa-percent text-pasha-600" />
                عروض الخصم فقط
              </span>
            </label>

            {filters.wishlistOnly && (
              <button
                type="button"
                onClick={() => setFilter('wishlistOnly', false)}
                className="inline-flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-bold text-rose-600 transition hover:bg-rose-100"
              >
                <i className="fa-solid fa-heart" /> المفضلة فقط
                <i className="fa-solid fa-xmark" />
              </button>
            )}
          </div>

          <div className="flex w-full items-center justify-between gap-2 sm:justify-end sm:gap-3 lg:w-auto">
            <button
              type="button"
              onClick={() => setShowFilters((value) => !value)}
              aria-expanded={showFilters}
              aria-controls="catalog-extra-filters"
              className={`flex items-center gap-1.5 rounded-2xl border px-3 py-2 text-[11px] font-bold transition sm:hidden ${
                showFilters || extraFilterCount > 0
                  ? 'border-pasha-300 bg-pasha-50 text-pasha-800'
                  : 'border-slate-200 bg-slate-50 text-slate-700'
              }`}
            >
              <i className="fa-solid fa-sliders" />
              تصفية
              {extraFilterCount > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-pasha-600 text-[9px] text-white">
                  {extraFilterCount}
                </span>
              )}
            </button>

            <div className="whitespace-nowrap text-[11px] font-medium leading-tight text-slate-500 sm:text-sm">
              عرض <span className="font-black text-pasha-700">{filtered.length}</span> منتج
              <span className="hidden sm:inline"> جاهز للشحن</span>
            </div>

            <div className="relative shrink-0">
              <select
                value={filters.sort}
                onChange={(event) => setFilter('sort', event.target.value)}
                aria-label="ترتيب المنتجات"
                className="max-w-[168px] cursor-pointer appearance-none truncate rounded-2xl border border-slate-200 bg-slate-50 py-2 pl-8 pr-3 text-[11px] font-bold text-slate-800 transition hover:bg-slate-100 focus:border-pasha-500 focus:outline-none sm:max-w-none sm:py-2.5 sm:pl-9 sm:pr-4 sm:text-sm"
              >
                <option value="featured">الأكثر طلباً</option>
                <option value="price-asc">السعر: الأقل أولاً</option>
                <option value="price-desc">السعر: الأعلى أولاً</option>
                <option value="rating">الأعلى تقييماً</option>
              </select>
              <i className="fa-solid fa-chevron-down pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400" />
            </div>
          </div>
        </div>

        {hasFilters && (
          <div className="mt-3 flex animate-fadeIn flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-pasha-800">
              <i className="fa-solid fa-filter text-pasha-600" />
              <span>الفلاتر النشطة:</span>
              {activeCategory && filters.category !== 'all' && (
                <span className="rounded-lg bg-pasha-100 px-2.5 py-0.5 text-pasha-800">
                  {activeCategory.label}
                </span>
              )}
              {Number(filters.maxPrice) < maxProductPrice && (
                <span className="rounded-lg bg-pasha-100 px-2.5 py-0.5 text-pasha-800">
                  حتى {money(filters.maxPrice, settings.currency)}
                </span>
              )}
              {filters.query && (
                <span className="rounded-lg bg-pasha-100 px-2.5 py-0.5 text-pasha-800">
                  البحث: «{filters.query}»
                </span>
              )}
              {filters.discountOnly && (
                <span className="rounded-lg bg-pasha-100 px-2.5 py-0.5 text-pasha-800">
                  عروض الخصم
                </span>
              )}
              {filters.wishlistOnly && (
                <span className="rounded-lg bg-rose-100 px-2.5 py-0.5 text-rose-700">
                  المفضلة
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={resetFilters}
              className="flex items-center gap-1 text-xs font-bold text-rose-600 transition hover:text-rose-700"
            >
              <i className="fa-solid fa-rotate-left" /> إعادة تعيين الفلاتر
            </button>
          </div>
        )}
      </Reveal>

      {filtered.length === 0 ? (
        <Reveal
          className="mx-auto my-8 max-w-lg rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-card"
        >
          <div className="mx-auto mb-4 flex h-20 w-20 animate-float items-center justify-center rounded-full bg-pasha-50 text-3xl text-pasha-600">
            <i className="fa-solid fa-spray-can-sparkles" />
          </div>
          <h3 className="mb-2 text-xl font-extrabold text-slate-800">
            لم نجد منتجات مطابقة لبحثك
          </h3>
          <p className="mb-6 text-sm text-slate-500">
            جرّب البحث بكلمات أخرى أو وسّع نطاق السعر وتصفّح جميع فئات متجر الباشا.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="rounded-2xl bg-pasha-600 px-6 py-3 text-sm font-bold text-white shadow transition hover:bg-pasha-700 active:scale-95"
          >
            عرض كافة منتجات الباشا
          </button>
        </Reveal>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product, index) => (
            <Reveal key={product.id} delay={Math.min(index, 8) * 70}>
              <ProductCard product={product} index={index} />
            </Reveal>
          ))}
        </div>
      )}
    </main>
  );
}
