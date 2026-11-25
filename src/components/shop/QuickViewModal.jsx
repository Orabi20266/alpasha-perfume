import { useEffect, useState } from 'react';
import ProductArt from '../ui/ProductArt';
import Stars from '../ui/Stars';
import { useStore } from '../../store/StoreContext';
import { useUi } from '../../store/UiContext';
import { discountPercent, money, waLink } from '../../lib/format';
import { categoryLabel } from '../../data/seed';

export default function QuickViewModal() {
  const {
    productById,
    settings,
    wishlist,
    toggleWishlist,
    addToCart,
    toast,
  } = useStore();
  const { quickViewId, closeQuickView } = useUi();
  const [qty, setQty] = useState(1);

  const product = quickViewId ? productById(quickViewId) : null;

  useEffect(() => {
    setQty(1);
  }, [quickViewId]);

  useEffect(() => {
    if (!quickViewId) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') closeQuickView();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [quickViewId, closeQuickView]);

  if (!product) return null;

  const isFav = wishlist.includes(product.id);
  const pct = discountPercent(product.price, product.oldPrice);
  const inStock = Number(product.stock) > 0;

  const handleAdd = () => {
    if (!inStock) {
      toast('هذا المنتج غير متوفر حالياً، تواصل معنا لمعرفة موعد التوصيل.', {
        type: 'error',
      });
      return;
    }
    addToCart(product.id, qty);
    toast(`تمت إضافة ${qty} × "${product.name}" إلى السلة`, {
      action: 'cart',
      type: 'success',
    });
    closeQuickView();
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex animate-fadeIn items-center justify-center bg-pasha-950/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={product.name}
      onClick={(event) => {
        if (event.target === event.currentTarget) closeQuickView();
      }}
    >
      <div className="max-h-[92vh] w-full max-w-3xl animate-scaleIn overflow-y-auto rounded-2xl border border-line bg-white shadow-lift">
        <div className="sticky top-0 z-10 flex items-center justify-between bg-gradient-to-l from-pasha-900 to-pasha-700 px-4 py-3.5 text-white sm:px-6 sm:py-4">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-spray-can-sparkles text-pasha-300" />
            <h3 className="text-sm font-extrabold sm:text-base">المواصفات التفصيلية للمنتج</h3>
          </div>
          <button
            type="button"
            onClick={closeQuickView}
            aria-label="إغلاق"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <div className="grid grid-cols-1 items-start gap-4 p-4 sm:gap-6 sm:p-6 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="relative flex flex-col items-center justify-center rounded-2xl border border-gold-200/60 bg-gradient-to-b from-white to-pasha-50/70 p-6">
              {pct > 0 && (
                <span className="absolute left-3 top-3 rounded-lg bg-gold-400 px-2 py-1 text-[11px] font-bold text-pasha-950">
                  وفر {pct}%
                </span>
              )}
              <div className="h-36 w-40 animate-floatSlow sm:h-44 sm:w-48">
                <ProductArt product={product} className="h-full w-full" />
              </div>
              <span className="mt-3 font-mono text-xs text-slate-400">
                رقم الموديل: {product.sku}
              </span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-bold text-slate-600">
                <i className="fa-solid fa-shield-halved text-pasha-600" />
                أصالة مضمونة
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-bold text-slate-600">
                <i className="fa-solid fa-hand-holding-dollar text-pasha-600" />
                دفع عند الاستلام
              </div>
            </div>
          </div>

          <div className="space-y-4 text-right md:col-span-7">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-pasha-100 px-3 py-1 text-xs font-bold text-pasha-800">
                {categoryLabel(product.category)}
              </span>
              <span
                className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
                  inStock
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-rose-50 text-rose-600'
                }`}
              >
                <i className="fa-solid fa-check" />
                {inStock ? 'متوفر للشحن الفوري' : 'غير متوفر حالياً'}
              </span>
              <button
                type="button"
                onClick={() => {
                  toggleWishlist(product.id);
                  toast(
                    isFav ? 'تمت الإزالة من المفضلة' : 'تمت الإضافة إلى المفضلة',
                    { type: 'info' },
                  );
                }}
                className={`mr-auto flex h-9 w-9 items-center justify-center rounded-xl border transition ${
                  isFav
                    ? 'border-rose-200 bg-rose-50 text-rose-500'
                    : 'border-slate-200 bg-slate-50 text-slate-400 hover:text-pasha-600'
                }`}
                aria-label="المفضلة"
              >
                <i className={`${isFav ? 'fa-solid' : 'fa-regular'} fa-heart`} />
              </button>
            </div>

            <h2 className="font-messiri text-xl font-bold text-ink sm:text-2xl">
              {product.name}
            </h2>

            <div className="flex items-center gap-2">
              <Stars rating={product.rating} className="text-xs" />
              <span className="text-xs font-bold text-slate-600">
                ({product.rating} من 5 • {product.reviews} تقييم)
              </span>
            </div>

            <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">
              {product.description}
            </p>

            <div className="rounded-2xl border border-slate-200/80 bg-slate-50 p-4">
              <h4 className="mb-2 flex items-center gap-1.5 text-xs font-extrabold text-pasha-900">
                <i className="fa-solid fa-list-check text-pasha-600" /> المواصفات والتفاصيل
                المعتمدة:
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {(product.specs || []).map((spec) => (
                  <li key={spec} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
                    {spec}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap items-end justify-between gap-4 border-t border-slate-100 pt-3">
              <div>
                {product.oldPrice && (
                  <span className="block text-xs text-slate-400 line-through">
                    {money(product.oldPrice, settings.currency)}
                  </span>
                )}
                <span className="display text-2xl text-pasha-900">
                  {money(product.price, settings.currency)}
                </span>
                <span className="mr-1 text-[10px] text-slate-400">شامل الضريبة</span>
              </div>

              <div className="inline-flex items-center overflow-hidden rounded-xl border border-slate-200 bg-white">
                <button
                  type="button"
                  onClick={() => setQty((value) => Math.max(1, value - 1))}
                  className="flex h-9 w-9 items-center justify-center font-bold text-slate-600 hover:bg-pasha-50"
                  aria-label="تقليل الكمية"
                >
                  -
                </button>
                <span className="w-9 text-center text-sm font-extrabold text-pasha-900">
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => setQty((value) => Math.min(99, value + 1))}
                  className="flex h-9 w-9 items-center justify-center font-bold text-slate-600 hover:bg-pasha-50"
                  aria-label="زيادة الكمية"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 sm:flex-row">
              <button
                type="button"
                onClick={handleAdd}
                className="btn-shine flex flex-1 items-center justify-center gap-2 rounded-2xl bg-pasha-600 px-5 py-3 text-sm font-extrabold text-white shadow-md transition hover:bg-pasha-700 hover:shadow-glow active:scale-[0.99]"
              >
                <i className="fa-solid fa-cart-plus" />
                إضافة إلى سلة المشتريات
              </button>
              <a
                href={waLink(
                  settings.whatsapp,
                  `مرحباً الباشا، أرغب بالاستفسار عن: ${product.name} (${product.sku}) بسعر ${money(product.price, settings.currency)}. هل هو متوفر؟`,
                )}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-extrabold text-emerald-700 transition hover:bg-emerald-100"
              >
                <i className="fa-brands fa-whatsapp text-lg" />
                استفسار واتساب
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
