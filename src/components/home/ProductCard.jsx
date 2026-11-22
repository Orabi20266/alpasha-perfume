import ProductArt from '../ui/ProductArt';
import Stars from '../ui/Stars';
import { useStore } from '../../store/StoreContext';
import { useUi } from '../../store/UiContext';
import { discountPercent, money } from '../../lib/format';
import { categoryLabel } from '../../data/seed';

const badgeTone = (type) => {
  if (type === 'discount') return 'bg-amber-400 text-pasha-950';
  if (type === 'new') return 'bg-emerald-500 text-white';
  return 'bg-pasha-600 text-white';
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
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-pasha-300 hover:shadow-soft sm:rounded-3xl"
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
    >
      <div className="z-10 flex items-start justify-between gap-1.5 p-3 pb-0 sm:gap-2 sm:p-4">
        <div className="flex flex-wrap items-center gap-1">
          <span className={`rounded-lg px-1.5 py-0.5 text-[9px] font-extrabold shadow-sm sm:rounded-xl sm:px-2.5 sm:py-1 sm:text-[11px] ${badgeTone(product.badgeType)}`}>
            {product.badge || 'جديد'}
          </span>
          {pct > 0 && (
            <span className="rounded-lg bg-pasha-100 px-1.5 py-0.5 text-[9px] font-black text-pasha-800 sm:rounded-xl sm:px-2 sm:py-1 sm:text-[11px]">
              وفر {pct}%
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={handleWishlist}
          aria-label={isFav ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
          aria-pressed={isFav}
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition active:scale-90 sm:h-9 sm:w-9 sm:rounded-xl ${
            isFav
              ? 'border-rose-200 bg-rose-50 text-rose-500'
              : 'border-slate-200/80 bg-slate-50 text-slate-400 hover:border-pasha-200 hover:text-pasha-600'
          }`}
        >
          <i className={`${isFav ? 'fa-solid' : 'fa-regular'} fa-heart text-[10px] transition-transform hover:scale-110 sm:text-sm`} />
        </button>
      </div>

      <button
        type="button"
        onClick={() => openQuickView(product.id)}
        className="relative flex h-32 items-center justify-center bg-gradient-to-b from-white via-pasha-50/30 to-pasha-50/60 px-4 py-2 transition-colors group-hover:from-pasha-50/40 group-hover:to-pasha-100/50 sm:h-48 sm:px-6"
        aria-label={`معاينة ${product.name}`}
      >
        <div className="h-24 w-28 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-1 sm:h-36 sm:w-40">
          <ProductArt product={product} className="h-full w-full" />
        </div>
        <span className="absolute bottom-2.5 left-1/2 hidden -translate-x-1/2 translate-y-2 items-center gap-1.5 rounded-xl bg-pasha-900/90 px-3.5 py-1.5 text-[11px] font-bold text-white opacity-0 shadow transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:flex">
          <i className="fa-solid fa-eye text-pasha-300" /> معاينة المواصفات
        </span>
        {!inStock && (
          <span className="absolute inset-0 flex items-center justify-center bg-white/60 text-[10px] font-extrabold text-rose-600 backdrop-blur-[1px] sm:text-xs">
            غير متوفر حالياً
          </span>
        )}
      </button>

      <div className="flex flex-1 flex-col justify-between border-t border-slate-100 bg-white p-3 sm:p-5">
        <div>
          <div className="mb-1 flex items-center justify-between gap-2 text-[9px] font-semibold text-slate-400 sm:mb-1.5 sm:text-[11px]">
            <span className="truncate rounded-md bg-pasha-50 px-1.5 py-0.5 font-bold text-pasha-600 sm:px-2">
              {categoryLabel(product.category)}
            </span>
            <span className="hidden font-mono sm:inline">{product.sku}</span>
          </div>

          <h3
            onClick={() => openQuickView(product.id)}
            className="mb-1.5 line-clamp-2 min-h-[2.1rem] cursor-pointer text-[12px] font-extrabold leading-snug text-slate-800 transition-colors group-hover:text-pasha-700 sm:mb-2 sm:min-h-0 sm:text-base"
          >
            {product.name}
          </h3>

          <ul className="mb-3 hidden space-y-1 text-xs text-slate-500 sm:block">
            {(product.specs || []).slice(0, 2).map((spec) => (
              <li key={spec} className="flex items-center gap-1.5 truncate">
                <i className="fa-solid fa-circle-check text-[10px] text-pasha-500" />
                <span className="truncate">{spec}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-slate-100 pt-2.5 sm:pt-3">
          <div className="mb-3 hidden items-center justify-between sm:flex">
            <div className="flex items-center gap-1">
              <Stars rating={product.rating} />
              <span className="text-xs font-extrabold text-slate-800">{product.rating}</span>
              <span className="text-[11px] text-slate-400">({product.reviews} تقييم)</span>
            </div>
            <span
              className={`flex items-center gap-1 text-[11px] font-bold ${inStock ? 'text-emerald-600' : 'text-rose-500'}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${inStock ? 'bg-emerald-500' : 'bg-rose-500'}`} />
              {inStock ? 'متوفر بالمستودع' : 'ينفد قريباً'}
            </span>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              {product.oldPrice ? (
                <span className="block text-[10px] font-medium text-slate-400 line-through sm:text-xs">
                  {money(product.oldPrice, settings.currency)}
                </span>
              ) : (
                <span className="block text-[9px] text-slate-400 sm:text-[10px]">شامل الضريبة</span>
              )}
              <div className="text-base font-black text-pasha-800 sm:text-xl">
                {product.price.toLocaleString('en-US')}{' '}
                <span className="text-[10px] font-bold text-pasha-600 sm:text-xs">{settings.currency}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              className="btn-shine flex w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-xl bg-pasha-600 px-3 py-2 text-[11px] font-bold text-white shadow-sm transition-all hover:bg-pasha-700 hover:shadow-glow active:scale-95 sm:w-auto sm:gap-2 sm:rounded-2xl sm:px-4 sm:py-3 sm:text-sm"
            >
              <i className="fa-solid fa-cart-plus" />
              <span>أضف للسلة</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
