import { useEffect } from 'react';
import ProductArt from '../ui/ProductArt';
import { useStore } from '../../store/StoreContext';
import { useUi } from '../../store/UiContext';
import { money, waLink } from '../../lib/format';

export default function CartDrawer() {
  const {
    cartItems,
    cartCount,
    settings,
    subtotal,
    discount,
    discountRate,
    appliedTier,
    discountTiers,
    tax,
    shipping,
    total,
    changeQty,
    removeFromCart,
    clearCart,
    toast,
  } = useStore();
  const { cartOpen, closeCart, openCheckout } = useUi();

  useEffect(() => {
    if (!cartOpen) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') closeCart();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [cartOpen, closeCart]);

  const threshold = Number(settings.freeShippingThreshold) || 1;
  const remaining = Math.max(0, threshold - subtotal);
  const progress = Math.min(100, Math.round((subtotal / threshold) * 100));
  const entryTier = discountTiers[0] || null;
  const discountGap = entryTier
    ? Math.max(0, entryTier.threshold - subtotal)
    : 0;

  const buildMessage = () => {
    const lines = cartItems.map(
      (line) =>
        `• ${line.product.name} — الكمية ${line.qty} — ${money(
          line.product.price * line.qty,
          settings.currency,
        )}`,
    );
    return [
      'مرحباً الباشا،',
      'أرغب بإتمام الطلب التالي وتأكيده عبر واتساب:',
      '',
      ...lines,
      '',
      `المجموع الفرعي: ${money(subtotal, settings.currency)}`,
      discount > 0
        ? `خصم الموسم (${discountRate}%): -${money(discount, settings.currency)}`
        : '',
      `الضريبة: ${money(tax, settings.currency)}`,
      `التوصيل: ${shipping ? money(shipping, settings.currency) : 'مجاني'}`,
      `الإجمالي: ${money(total, settings.currency)}`,
      'طريقة الدفع: عند الاستلام',
      '',
      'ملاحظة: بعد تأكيد الطلب سأحصل على رقم سحب للمشاركة في سحب الباشا الذهبي.',
    ]
      .filter(Boolean)
      .join('\n');
  };

  const orderOnWhatsApp = () => {
    if (!cartItems.length) return;
    window.open(waLink(settings.whatsapp, buildMessage()), '_blank', 'noopener');
    toast('تم فتح واتساب مع تفاصيل طلبك — أرسل الرسالة لتأكيد الطلب.', {
      type: 'info',
    });
  };

  const handleClear = () => {
    clearCart();
    toast('تم إفراغ سلة المشتريات.', { type: 'info' });
  };

  return (
    <>
      <div
        aria-hidden={!cartOpen}
        onClick={closeCart}
        className={`fixed inset-0 z-50 bg-pasha-950/50 backdrop-blur-sm transition-opacity duration-300 ${
          cartOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="سلة المشتريات"
        aria-hidden={!cartOpen}
        className={`fixed left-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-lift transition-transform duration-500 [transition-timing-function:cubic-bezier(.22,1,.36,1)] ${
          cartOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between bg-gradient-to-l from-pasha-900 to-pasha-700 p-5 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 text-lg">
              <i className="fa-solid fa-bag-shopping" />
            </div>
            <div>
              <h3 className="text-base font-extrabold">سلة المشتريات</h3>
              <p className="text-xs text-pasha-200">
                {cartCount ? `${cartCount} قطعة جاهزة للتوصيل` : 'عطور وعود وبخور جاهزة للتوصيل'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeCart}
            aria-label="إغلاق السلة"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 transition hover:bg-white/20"
          >
            <i className="fa-solid fa-xmark text-lg" />
          </button>
        </div>

        <div className="border-b border-gold-200/70 bg-gold-50/50 px-5 py-3">
          <div className="mb-1.5 flex items-center justify-between text-xs font-bold text-pasha-900">
            <span>
              <i className="fa-solid fa-truck-fast ml-1 text-gold-700" />
              {subtotal >= threshold
                ? 'طلبك مؤهل للشحن المجاني'
                : `أضف بقيمة ${money(remaining, settings.currency)} لشحن مجاني`}
            </span>
            <span className="text-gold-700">{progress}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gold-100">
            <div
              className="h-full rounded-full bg-gradient-to-l from-pasha-700 to-pasha-900 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="border-b border-gold-200 bg-gradient-to-l from-gold-50 to-white px-5 py-2.5">
          <div className="flex items-center justify-between text-[11px] font-bold text-gold-900">
            <span className="flex items-center gap-1.5">
              <i className="fa-solid fa-percent text-gold-600" />
              خصم الموسم
            </span>
            <span className={discount > 0 ? 'text-emerald-700' : 'text-gold-600'}>
              {appliedTier ? `${appliedTier.percent}%` : 'لم تُفعّل بعد'}
            </span>
          </div>
          <p className="mt-1 text-[10px] leading-relaxed text-gold-800/80">
            {appliedTier
              ? `خصمك الحالي ${appliedTier.percent}% — وفرت ${money(discount, settings.currency)}`
              : entryTier
                ? `أضف ${money(discountGap, settings.currency)} للوصول إلى خصم ${entryTier.percent}%`
                : 'أضف منتجات لبدء شريحة الخصم'}
          </p>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {!cartItems.length ? (
            <div className="flex h-full flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 flex h-20 w-20 animate-float items-center justify-center rounded-full bg-pasha-50 text-3xl text-pasha-400">
                <i className="fa-solid fa-bag-shopping" />
              </div>
              <h4 className="mb-1 text-base font-extrabold text-slate-800">
                سلتك فارغة
              </h4>
              <p className="mb-5 max-w-xs text-xs text-slate-500">
                اختر من العطور والعود والبخور ومستلزمات العناية من الواجهة الرئيسية
                لإضافتها إلى طلبك.
              </p>
              <button
                type="button"
                onClick={closeCart}
                className="rounded-xl bg-pasha-600 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-pasha-700"
              >
                تصفح المنتجات الآن
              </button>
            </div>
          ) : (
            cartItems.map((line, index) => (
              <div
                key={line.product.id}
                className="flex animate-fadeUp items-center gap-3.5 rounded-2xl border border-line/80 bg-slate-50 p-3.5 transition hover:border-pasha-200 hover:bg-pasha-50/40"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-white p-1.5">
                  <ProductArt product={line.product} className="h-full w-full" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="truncate text-xs font-bold text-slate-800 sm:text-sm">
                    {line.product.name}
                  </h4>
                  <span className="block text-[11px] text-slate-400">
                    {money(line.product.price, settings.currency)} للوحدة
                  </span>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <div className="inline-flex items-center overflow-hidden rounded-xl border border-line bg-white">
                      <button
                        type="button"
                        onClick={() => changeQty(line.product.id, -1)}
                        aria-label="تقليل الكمية"
                        className="flex h-7 w-7 items-center justify-center font-bold text-slate-600 transition hover:bg-pasha-50"
                      >
                        -
                      </button>
                      <span className="px-2.5 text-xs font-extrabold text-pasha-900">
                        {line.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => changeQty(line.product.id, 1)}
                        aria-label="زيادة الكمية"
                        className="flex h-7 w-7 items-center justify-center font-bold text-slate-600 transition hover:bg-pasha-50"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-xs font-bold text-pasha-700 sm:text-sm">
                      {money(line.product.price * line.qty, settings.currency)}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFromCart(line.product.id)}
                  aria-label={`حذف ${line.product.name}`}
                  className="p-1.5 text-slate-400 transition hover:text-rose-500"
                >
                  <i className="fa-solid fa-trash-can text-sm" />
                </button>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="space-y-4 border-t border-line bg-slate-50 p-5">
            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between text-slate-600">
                <span>المجموع الفرعي:</span>
                <span className="font-bold text-slate-800">{money(subtotal, settings.currency)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between rounded-lg bg-emerald-50 px-2 py-1 text-emerald-700">
                  <span>خصم الموسم ({discountRate}%):</span>
                  <span className="font-bold">- {money(discount, settings.currency)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>ضريبة القيمة المضافة ({settings.taxRate}%):</span>
                <span className="font-bold text-slate-800">{money(tax, settings.currency)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>رسوم التوصيل:</span>
                <span className="font-bold text-emerald-600">
                  {shipping ? money(shipping, settings.currency) : 'مجاني'}
                </span>
              </div>
              <div className="flex items-baseline justify-between border-t border-line pt-2 text-base font-bold text-pasha-950 sm:text-lg">
                <span>الإجمالي النهائي:</span>
                <span className="text-xl text-pasha-700">{money(total, settings.currency)}</span>
              </div>
              <p className="flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-2 text-[11px] font-bold text-emerald-700">
                <i className="fa-solid fa-hand-holding-dollar" />
                الدفع عند الاستلام — افحص مشترياتك قبل الدفع.
              </p>
              <p className="flex items-center gap-1.5 rounded-xl bg-gold-50 px-3 py-2 text-[11px] font-bold text-gold-800">
                <i className="fa-solid fa-gem" />
                بعد تأكيد الطلب تحصل على رقم سحب لسحب الباشا الذهبي.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              <button
                type="button"
                onClick={() => openCheckout('order')}
                className="btn-shine flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-pasha-700 to-pasha-600 px-5 py-3.5 font-extrabold text-white shadow-md transition hover:from-pasha-800 hover:to-pasha-700 hover:shadow-glow active:scale-[0.99]"
              >
                <i className="fa-solid fa-shield-halved" />
                <span>إتمام الطلب وتحديد عنوان التوصيل</span>
              </button>
              <button
                type="button"
                onClick={orderOnWhatsApp}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 py-3 text-xs font-extrabold text-emerald-700 transition hover:bg-emerald-100"
              >
                <i className="fa-brands fa-whatsapp text-base" />
                أو اطلب عبر واتساب مباشرة
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="w-full py-1.5 text-xs font-bold text-slate-500 transition hover:text-rose-600"
              >
                إفراغ السلة بالكامل
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
