import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Logo from '../ui/Logo';
import { useStore } from '../../store/StoreContext';
import { useUi } from '../../store/UiContext';
import { money } from '../../lib/format';

export default function Header() {
  const { settings, cartCount, total, wishlist, toast } = useStore();
  const { openCart, openCheckout, filters, setFilter, resetFilters } = useUi();
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);

  useEffect(() => {
    const onKey = (event) => {
      const tag = document.activeElement?.tagName;
      if (
        event.key === '/' &&
        !['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)
      ) {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const goHome = () => {
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const jump = (id) => {
    const scroll = () =>
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(scroll, 90);
    } else {
      scroll();
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();
    if (location.pathname !== '/') navigate('/');
    setTimeout(() => jump('catalog'), 80);
  };

  const handleWishlist = () => {
    if (!wishlist.length) {
      toast('قائمة المفضلة فارغة، اضغط على القلب في أي منتج لإضافته.', {
        type: 'info',
      });
      return;
    }
    if (location.pathname !== '/') navigate('/');
    setFilter('wishlistOnly', !filters.wishlistOnly);
    setTimeout(() => jump('catalog'), 80);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-gold-200/70 bg-ivory/95 shadow-card backdrop-blur-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 py-3.5 lg:gap-8">
          <Logo />

          <form
            onSubmit={handleSearch}
            role="search"
            className="relative hidden max-w-2xl flex-1 items-center lg:flex"
          >
            <i className="fa-solid fa-magnifying-glass pointer-events-none absolute right-4 text-sm text-gold-600" />
            <input
              ref={searchRef}
              type="search"
              value={filters.query}
              onChange={(event) => setFilter('query', event.target.value)}
              placeholder="ابحث عن عطر (عود، مسك، ورد، بخور...)"
              className="w-full rounded-xl border border-line bg-white py-2.5 pl-24 pr-11 text-sm font-medium text-ink transition-all placeholder:text-slate-400 hover:border-gold-300 focus:border-gold-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-gold-500/10"
            />
            {filters.query ? (
              <button
                type="button"
                onClick={() => setFilter('query', '')}
                className="absolute left-16 rounded p-1 text-slate-400 transition hover:text-rose-500"
                aria-label="مسح البحث"
              >
                <i className="fa-solid fa-circle-xmark" />
              </button>
            ) : (
              <span className="pointer-events-none absolute left-3 hidden rounded-lg bg-gold-50 px-2.5 py-1 text-[10px] font-bold text-gold-800 sm:inline-block">
                بحث فوري
              </span>
            )}
          </form>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={handleWishlist}
              className={`relative rounded-xl border p-2.5 transition ${
                filters.wishlistOnly
                  ? 'border-rose-200 bg-rose-50 text-rose-500'
                  : 'border-line bg-white text-slate-500 hover:border-gold-300 hover:text-gold-700'
              }`}
              title="المنتجات المفضلة"
              aria-label="المنتجات المفضلة"
            >
              <i
                className={`${filters.wishlistOnly ? 'fa-solid' : 'fa-regular'} fa-heart text-base transition-transform hover:scale-110`}
              />
              {wishlist.length > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 animate-pop items-center justify-center rounded-full bg-gold-400 text-[10px] font-bold text-pasha-950 shadow-sm">
                  {wishlist.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => openCheckout('quote')}
              className="hidden items-center gap-2 rounded-xl border border-gold-300 bg-gold-50 px-4 py-2.5 text-[11px] font-bold text-gold-800 transition hover:bg-gold-100 xl:flex"
            >
              <i className="fa-solid fa-file-invoice-dollar text-sm text-gold-600" />
              <span>طلب عرض سعر خاص</span>
            </button>

            <button
              type="button"
              onClick={openCart}
              aria-label="سلة المشتريات"
              title="سلة المشتريات"
              className="btn-shine group relative flex items-center gap-3 rounded-xl border border-gold-400/40 bg-pasha-950 px-4 py-2.5 text-gold-100 shadow-card transition-all hover:bg-pasha-900 active:scale-95 sm:px-5"
            >
              <span className="relative">
                <i className="fa-solid fa-bag-shopping text-base" />
                <span
                  key={cartCount}
                  className="absolute -right-2.5 -top-2.5 flex h-5 w-5 animate-pop items-center justify-center rounded-full border-2 border-pasha-950 bg-gold-400 text-[10px] font-bold text-pasha-950 shadow"
                >
                  {cartCount}
                </span>
              </span>
              <span className="hidden text-right sm:block">
                <span className="block text-[9px] font-medium leading-none text-gold-200/70">
                  سلة المشتريات
                </span>
                <span className="text-xs font-extrabold leading-tight">
                  {money(total, settings.currency)}
                </span>
              </span>
            </button>
          </div>
        </div>

        <form
          onSubmit={handleSearch}
          role="search"
          className="relative flex items-center pb-3 lg:hidden"
        >
          <i className="fa-solid fa-magnifying-glass pointer-events-none absolute right-4 text-sm text-gold-600" />
          <input
            type="search"
            value={filters.query}
            onChange={(event) => setFilter('query', event.target.value)}
            placeholder="ابحث عن منتج..."
            aria-label="البحث في المتجر"
            className="w-full rounded-xl border border-line bg-white py-2.5 pl-10 pr-11 text-sm focus:border-gold-500 focus:outline-none"
          />
          {filters.query && (
            <button
              type="button"
              onClick={() => setFilter('query', '')}
              className="absolute left-3 p-1 text-slate-400 hover:text-rose-500"
              aria-label="مسح البحث"
            >
              <i className="fa-solid fa-circle-xmark" />
            </button>
          )}
        </form>

        <nav className="hidden items-center justify-between border-t border-line py-2.5 md:flex">
          <ul className="flex items-center gap-6 text-xs font-bold text-slate-600">
            <li>
              <button type="button" onClick={goHome} className="underline-grow py-1 transition hover:text-pasha-800">
                الرئيسية
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => {
                  resetFilters();
                  jump('catalog');
                }}
                className="underline-grow py-1 transition hover:text-pasha-800"
              >
                كل المنتجات
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => navigate('/offers')}
                className="flex items-center gap-1.5 py-1 text-pasha-800 transition hover:text-gold-700"
              >
                <i className="fa-solid fa-bolt text-gold-500" />
                العروضات
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => navigate('/raffle')}
                className="flex items-center gap-1.5 py-1 text-gold-700 transition hover:text-gold-900"
              >
                <i className="fa-solid fa-gem text-gold-500" />
                سحب الباشا
              </button>
            </li>
            <li>
              <button type="button" onClick={() => jump('why-pasha')} className="underline-grow py-1 transition hover:text-pasha-800">
                لماذا الباشا
              </button>
            </li>
            <li>
              <button type="button" onClick={() => jump('contact')} className="underline-grow py-1 transition hover:text-pasha-800">
                تواصل معنا
              </button>
            </li>
          </ul>
          <div className="flex items-center gap-4">
            <a
              href={`https://wa.me/${settings.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              dir="ltr"
              className="flex items-center gap-2 text-[11px] font-extrabold text-emerald-700 transition hover:text-emerald-800"
            >
              <i className="fa-brands fa-whatsapp text-sm" />
              {settings.whatsappDisplay}
            </a>
            <span className="h-4 w-px bg-line" />
            <a
              href="#catalog"
              onClick={(event) => {
                event.preventDefault();
                resetFilters();
                jump('catalog');
              }}
              className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] font-bold text-slate-500 transition hover:bg-gold-50 hover:text-pasha-800"
            >
              <i className="fa-solid fa-spray-can-sparkles text-gold-600" /> تسوّق الآن
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
