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
    <section id="catalog" className="mx-auto max-w-7xl px-4 pb-14 pt-10 sm:px-6 sm:pt-14 lg:px-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3 sm:mb-8">
        <div>
          <span className="section-eyebrow">المجموعة</span>
          <h2 className="display mt-2 text-3xl text-ink sm:text-4xl">
            عطور الباشا
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-slate-500 sm:text-sm">
            عطور شرقية وفرنسية فاخرة — ولمسة من العود والمسك، والدفع عند الاستلام
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => openCheckout('quote')}
            className="flex items-center gap-2 rounded-xl border border-gold-300 bg-white px-4 py-2.5 text-xs font-bold text-pasha-700 transition hover:border-gold-400 hover:bg-gold-50"
          >
            <i className="fa-solid fa-file-invoice-dollar text-gold-600" />
            عرض سعر خاص
          </button>
          <Link
            to="/offers"
            className="flex items-center gap-2 rounded-xl bg-pasha-900 px-4 py-2.5 text-xs font-bold text-gold-100 transition hover:bg-pasha-800"
          >
            <i className="fa-solid fa-bolt text-gold-300" />
            عروض الموسم
          </Link>
        </div>
      </div>

      <Reveal className="mb-6 rounded-2xl border border-line bg-white/85 p-4 shadow-card backdrop-blur sm:p-5">
        <div className="flex items-center justify-between gap-4 border-b border-line pb-4">
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
                  className={`flex shrink-0 items-center gap-2 border-b-2 px-1 pb-2 pt-1 text-xs font-bold transition-colors duration-300 sm:text-sm ${
                    active
                      ? 'border-gold-500 text-pasha-900'
                      : 'border-transparent text-slate-500 hover:text-pasha-700'
                  }`}
                >
                  <i className={`fa-solid ${category.icon} ${active ? 'text-gold-600' : 'text-gold-500/70'}`} />
                  <span>{category.label}</span>
                  {category.id === 'all' && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] ${
                        active ? 'bg-gold-100 text-gold-800' : 'bg-slate-100 text-slate-500'
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
            <div className="flex w-full items-center gap-3 rounded-2xl border border-line bg-white px-4 py-2 sm:w-auto sm:flex-initial">
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
                  : 'border-line bg-white text-slate-600'
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
              عرض <span className="font-bold text-pasha-700">{filtered.length}</span> منتج
              <span className="hidden sm:inline"> جاهز للشحن</span>
            </div>

            <div className="relative shrink-0">
              <select
                value={filters.sort}
                onChange={(event) => setFilter('sort', event.target.value)}
                aria-label="ترتيب المنتجات"
                className="max-w-[168px] cursor-pointer appearance-none truncate rounded-2xl border border-line bg-white py-2 pl-8 pr-3 text-[11px] font-bold text-slate-800 transition hover:bg-gold-50 focus:border-gold-500 focus:outline-none sm:max-w-none sm:py-2.5 sm:pl-9 sm:pr-4 sm:text-sm"
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
          className="mx-auto my-8 max-w-lg rounded-2xl border border-line bg-white p-12 text-center shadow-card"
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
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-7 xl:grid-cols-4">
          {filtered.map((product, index) => (
            <Reveal key={product.id} delay={Math.min(index, 8) * 70}>
              <ProductCard product={product} index={index} />
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
