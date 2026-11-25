import ProductArt from '../ui/ProductArt';
import Stars from '../ui/Stars';
import { useStore } from '../../store/StoreContext';
import { useUi } from '../../store/UiContext';
import { discountPercent, money } from '../../lib/format';
import { categoryLabel } from '../../data/seed';

const badgeTone = (type) => {
  if (type === 'discount') return 'bg-gold-400 text-pasha-950';
  if (type === 'new') return 'bg-pasha-900 text-gold-100';
  return 'bg-pasha-700 text-white';
};

export default function ProductCard({ product, index = 0 }) {
  const { settings, wishlist, toggleWishlist, addToCart, toast } = useStore();
  const { openQuickView } = useUi();

  const isFav = wishlist.includes(product.id);
  const pct = discountPercent(product.price, product.oldPrice);
  const inStock = Number(product.stock) > 0;

  const handleWishlist = () => {
    toggleWishlist(product.id);
    toast(
      isFav
        ? `تمت إزالة "${product.name}" من المفضلة`
        : `تمت إضافة "${product.name}" إلى المفضلة`,
      { type: isFav ? 'info' : 'success' },
    );
  };

  const handleAdd = () => {
    if (!inStock) {
      toast('هذا المنتج غير متوفر حالياً، تواصل معنا لمعرفة موعد التوصيل.', {
        type: 'error',
      });
      return;
    }
    addToCart(product.id);
    toast(`تمت إضافة "${product.name}" إلى السلة`, {
      action: 'cart',
      type: 'success',
    });
  };

  return (
    <article
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-card transition-all duration-500 hover:-translate-y-1.5 hover:border-gold-300 hover:shadow-lift"
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
    >
      <div className="z-10 flex items-start justify-between gap-2 p-3 pb-0 sm:p-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className={`rounded-lg px-2 py-1 text-[9px] font-extrabold sm:text-[10px] ${badgeTone(product.badgeType)}`}>
            {product.badge || 'جديد'}
          </span>
          {pct > 0 && (
            <span className="rounded-lg bg-pasha-100 px-2 py-1 text-[9px] font-bold text-pasha-800 sm:text-[10px]">
              وفر {pct}%
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={handleWishlist}
          aria-label={isFav ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
          aria-pressed={isFav}
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition active:scale-90 sm:h-9 sm:w-9 ${
            isFav
              ? 'border-rose-200 bg-rose-50 text-rose-500'
              : 'border-line bg-white text-slate-400 hover:border-gold-300 hover:text-gold-700'
          }`}
        >
          <i className={`${isFav ? 'fa-solid' : 'fa-regular'} fa-heart text-xs sm:text-sm`} />
        </button>
      </div>

      <button
        type="button"
        onClick={() => openQuickView(product.id)}
        className="relative flex h-40 items-center justify-center bg-gradient-to-b from-white via-ivory to-pasha-50/70 px-5 py-3 transition-colors group-hover:to-pasha-100/60 sm:h-56 sm:px-8"
        aria-label={`معاينة ${product.name}`}
      >
        <span className="absolute inset-x-6 inset-y-3 rounded-xl border border-gold-200/60" />
        <span className="relative h-28 w-32 transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-1 sm:h-40 sm:w-44">
          <ProductArt product={product} className="h-full w-full" />
        </span>
        <span className="absolute bottom-3 left-1/2 hidden -translate-x-1/2 translate-y-2 items-center gap-1.5 rounded-lg bg-pasha-950/90 px-3 py-1.5 text-[10px] font-bold text-gold-200 opacity-0 shadow transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:flex">
          <i className="fa-solid fa-eye" /> معاينة المواصفات
        </span>
        {!inStock && (
          <span className="absolute inset-0 flex items-center justify-center bg-ivory/70 text-xs font-extrabold text-rose-600 backdrop-blur-[1px]">
            غير متوفر حالياً
          </span>
        )}
      </button>

      <div className="flex flex-1 flex-col justify-between border-t border-line bg-white p-4 sm:p-5">
        <div>
          <div className="mb-2 flex items-center justify-between gap-2 text-[10px] font-semibold text-slate-400 sm:text-[11px]">
            <span className="truncate rounded-md bg-gold-50 px-2 py-0.5 font-bold text-gold-700">
              {categoryLabel(product.category)}
            </span>
            <span className="hidden font-mono tracking-tight sm:inline">{product.sku}</span>
          </div>

          <h3
            onClick={() => openQuickView(product.id)}
            className="mb-2 line-clamp-2 min-h-[2.6rem] cursor-pointer font-messiri text-sm font-bold leading-snug text-ink transition-colors group-hover:text-pasha-700 sm:min-h-0 sm:text-base"
          >
            {product.name}
          </h3>

          <ul className="mb-4 hidden space-y-1.5 text-xs text-slate-500 sm:block">
            {(product.specs || []).slice(0, 2).map((spec) => (
              <li key={spec} className="flex items-center gap-2 truncate">
                <i className="fa-solid fa-circle-check text-[10px] text-gold-600" />
                <span className="truncate">{spec}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-line pt-3">
          <div className="mb-3 hidden items-center justify-between sm:flex">
            <div className="flex items-center gap-1.5">
              <Stars rating={product.rating} className="text-xs" />
              <span className="text-xs font-extrabold text-ink">{product.rating}</span>
              <span className="text-[11px] text-slate-400">({product.reviews} تقييم)</span>
            </div>
            <span
              className={`flex items-center gap-1.5 text-[11px] font-bold ${inStock ? 'text-emerald-700' : 'text-rose-500'}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${inStock ? 'bg-emerald-500' : 'bg-rose-500'}`} />
              {inStock ? 'متوفر بالمستودع' : 'ينفد قريباً'}
            </span>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              {product.oldPrice ? (
                <span className="block text-[10px] font-medium text-slate-400 line-through sm:text-xs">
                  {money(product.oldPrice, settings.currency)}
                </span>
              ) : (
                <span className="block text-[9px] text-slate-400 sm:text-[10px]">شامل الضريبة</span>
              )}
              <div className="display text-2xl text-pasha-900 sm:text-3xl">
                {product.price.toLocaleString('en-US')}{' '}
                <span className="font-cairo text-[10px] font-bold text-gold-700 sm:text-xs">
                  {settings.currency}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              className="btn-shine flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-pasha-900 bg-white px-4 py-2.5 text-[11px] font-extrabold text-pasha-900 transition-all hover:bg-pasha-900 hover:text-gold-100 active:scale-95 sm:w-auto sm:text-xs"
            >
              <i className="fa-solid fa-plus" />
              <span>أضف للسلة</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
