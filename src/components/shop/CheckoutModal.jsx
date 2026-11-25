import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../store/StoreContext';
import { useUi } from '../../store/UiContext';
import { digitsOnly, money, waLink } from '../../lib/format';

const emptyForm = {
  name: '',
  phone: '',
  company: '',
  city: '',
  address: '',
  notes: '',
};

export default function CheckoutModal() {
  const {
    settings,
    cartItems,
    cartCount,
    subtotal,
    discount,
    discountRate,
    discountTiers,
    tax,
    shipping,
    total,
    placeOrder,
    toast,
  } = useStore();
  const { checkout, closeCheckout } = useUi();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(null);
  const bodyRef = useRef(null);

  const isQuote = checkout.mode === 'quote';
  const open = checkout.open;
  const entryTier = discountTiers[0] || null;

  useEffect(() => {
    if (open) {
      setForm(emptyForm);
      setErrors({});
      setSuccess(null);
    }
  }, [open, checkout.mode]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') closeCheckout();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, closeCheckout]);

  if (!open) return null;

  const update = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim() || form.name.trim().length < 3) {
      next.name = 'أدخل الاسم الكامل (3 أحرف على الأقل)';
    }
    if (digitsOnly(form.phone).length < 7) {
      next.phone = 'أدخل رقم جوال صحيح للتواصل';
    }
    if (!form.city.trim()) {
      next.city = 'أدخل اسم المدينة أو منطقة التوصيل';
    }
    if (!isQuote && !form.address.trim()) {
      next.address = 'أدخل العنوان التفصيلي للتوصيل';
    }
    if (!isQuote && cartItems.length === 0) {
      next.cart = 'السلة فارغة، أضف منتجات قبل إتمام الطلب';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const messageFromOrder = (order) => {
    const customer = order.customer || {};
    const lines = (order.items || []).map(
      (item) =>
        `• ${item.name} — الكمية ${item.qty} — ${money(
          item.price * item.qty,
          settings.currency,
        )}`,
    );
    return [
      isQuote
        ? 'مرحباً الباشا، أرغب بمتابعة طلب عرض السعر التالي:'
        : 'مرحباً الباشا، أرغب بمتابعة طلب الشراء التالي:',
      `رقم الطلب: ${order.id}`,
      '',
      ...(lines.length ? lines : ['• طلب عرض سعر لكمية خاصة']),
      '',
      `الاسم: ${customer.name || ''}`,
      `الجوال: ${customer.phone || ''}`,
      customer.company ? `الشركة / المتجر: ${customer.company}` : '',
      `المدينة / منطقة التوصيل: ${customer.city || ''}`,
      customer.address ? `العنوان: ${customer.address}` : '',
      customer.notes ? `ملاحظات: ${customer.notes}` : '',
      '',
      ...(isQuote
        ? ['المطلوب: عرض سعر مخصص حسب الكمية المذكورة']
        : [
            `المجموع الفرعي: ${money(order.subtotal, settings.currency)}`,
            order.discount > 0
              ? `خصم الموسم (${order.discountRate}%): -${money(order.discount, settings.currency)}`
              : '',
            `الضريبة: ${money(order.tax, settings.currency)}`,
            `التوصيل: ${order.shipping ? money(order.shipping, settings.currency) : 'مجاني'}`,
            `الإجمالي: ${money(order.total, settings.currency)}`,
            'طريقة الدفع: عند الاستلام',
            order.raffleCode ? `رقم السحب (سحب الباشا الذهبي): ${order.raffleCode}` : '',
          ]),
    ]
      .filter(Boolean)
      .join('\n');
  };

  const resetScroll = () => {
    bodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submitElectronic = (event) => {
    event.preventDefault();
    if (!validate()) {
      resetScroll();
      toast('يرجى إكمال الحقول المطلوبة قبل تأكيد الطلب.', { type: 'error' });
      return;
    }
    const order = placeOrder({
      type: isQuote ? 'quote' : 'order',
      customer: { ...form },
    });
    setSuccess(order);
    toast(
      isQuote
        ? `تم استلام طلب عرض السعر برقم ${order.id}`
        : `تم اعتماد طلبك بنجاح برقم ${order.id}`,
      { type: 'success' },
    );
  };

  const submitWhatsApp = () => {
    if (!validate()) {
      resetScroll();
      toast('يرجى إكمال الحقول المطلوبة قبل المتابعة عبر واتساب.', {
        type: 'error',
      });
      return;
    }
    const order = placeOrder({
      type: isQuote ? 'quote' : 'order',
      customer: { ...form },
    });
    window.open(
      waLink(settings.whatsapp, messageFromOrder(order)),
      '_blank',
      'noopener',
    );
    setSuccess(order);
    toast('تم فتح واتساب مع تفاصيل طلبك — أرسل الرسالة لإتمام التأكيد.', {
      type: 'info',
    });
  };

  const copyRaffleCode = async () => {
    if (!success?.raffleCode) return;
    try {
      await navigator.clipboard.writeText(success.raffleCode);
      toast(`تم نسخ رقم السحب ${success.raffleCode}.`, { type: 'success' });
    } catch {
      toast(`رقم سحبك: ${success.raffleCode}`, { type: 'info' });
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex animate-fadeIn items-center justify-center bg-pasha-950/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={isQuote ? 'طلب عرض سعر خاص' : 'إتمام الطلب'}
      onClick={(event) => {
        if (event.target === event.currentTarget) closeCheckout();
      }}
    >
      <div className="flex max-h-[92vh] w-full max-w-xl animate-scaleIn flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-lift">
        <div className="flex shrink-0 items-center justify-between bg-gradient-to-l from-pasha-900 to-pasha-700 px-6 py-4 text-white">
          <div className="flex items-center gap-2.5">
            <i
              className={`fa-solid ${isQuote ? 'fa-file-invoice-dollar' : 'fa-clipboard-check'} text-lg text-pasha-300`}
            />
            <div>
              <h3 className="text-base font-extrabold">
                {isQuote ? 'طلب عرض سعر خاص' : 'إتمام طلبك من الباشا'}
              </h3>
              <p className="text-[11px] text-pasha-200">
                {isQuote
                  ? 'أرسل تفاصيل طلبك وسنعود إليك بعرض سعر مخصص'
                  : 'الدفع عند الاستلام — افحص مشترياتك قبل الدفع'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeCheckout}
            aria-label="إغلاق"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {success ? (
          <div className="overflow-y-auto p-6 text-center sm:p-8">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
              <svg viewBox="0 0 52 52" className="h-12 w-12" aria-hidden="true">
                <circle
                  cx="26"
                  cy="26"
                  r="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  opacity="0.25"
                />
                <path
                  d="M15 27l7 7 15-16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="100"
                  style={{ animation: 'drawCheck .7s ease forwards' }}
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              {isQuote ? 'تم استلام طلب عرض السعر' : 'تم اعتماد طلبك بنجاح'}
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              سيتواصل معك فريق الباشا على الرقم{' '}
              <span dir="ltr" className="font-bold text-pasha-700">
                {form.phone || settings.whatsappDisplay}
              </span>{' '}
              لتأكيد موعد التوصيل.
            </p>

            <div className="mx-auto mt-5 max-w-sm space-y-2 rounded-2xl border border-pasha-100 bg-pasha-50/70 p-4 text-right text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">رقم الطلب:</span>
                <span className="font-mono font-bold text-pasha-800">{success.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">طريقة الدفع:</span>
                <span className="font-bold text-emerald-700">عند الاستلام</span>
              </div>
              {!isQuote && success.discount > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">خصم الموسم ({success.discountRate}%):</span>
                  <span className="font-bold text-emerald-700">
                    - {money(success.discount, settings.currency)}
                  </span>
                </div>
              )}
              {!isQuote && (
                <div className="flex items-center justify-between border-t border-pasha-100 pt-2">
                  <span className="text-slate-500">الإجمالي:</span>
                  <span className="text-base font-bold text-pasha-700">
                    {money(success.total, settings.currency)}
                  </span>
                </div>
              )}
            </div>

            {!isQuote && success.raffleCode && settings.raffle?.enabled && (
              <div className="mx-auto mt-4 max-w-sm rounded-2xl border border-gold-200 bg-gradient-to-br from-gold-50 to-white p-4 text-right">
                <p className="flex items-center justify-center gap-2 text-[11px] font-bold text-gold-800">
                  <i className="fa-solid fa-gem" />
                  رقمك في {settings.raffle.title}
                </p>
                <button
                  type="button"
                  onClick={copyRaffleCode}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-3 py-2.5 font-mono text-lg font-bold tracking-widest text-pasha-900 shadow-sm ring-1 ring-gold-200 transition hover:ring-gold-400"
                  title="نسخ رقم السحب"
                  dir="ltr"
                >
                  {success.raffleCode}
                  <i className="fa-solid fa-copy text-xs text-gold-600" />
                </button>
                <p className="mt-2 text-center text-[10px] leading-relaxed text-gold-800/80">
                  احتفظ بهذا الرقم وأدخله في صفحة السحب لتسجيل مشاركتك.
                </p>
                <Link
                  to="/raffle"
                  onClick={closeCheckout}
                  className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-gold-400 px-3 py-2 text-[11px] font-extrabold text-pasha-950 transition hover:bg-gold-300"
                >
                  <i className="fa-solid fa-ticket" />
                  تسجيل رقمي في السحب
                </Link>
              </div>
            )}

            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
              <button
                type="button"
                onClick={closeCheckout}
                className="flex-1 rounded-2xl bg-pasha-600 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-pasha-700"
              >
                متابعة التسوق
              </button>
              <a
                href={waLink(settings.whatsapp, messageFromOrder(success))}
                target="_blank"
                rel="noreferrer"
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-extrabold text-emerald-700 transition hover:bg-emerald-100"
              >
                <i className="fa-brands fa-whatsapp text-lg" />
                تأكيد عبر واتساب
              </a>
            </div>
          </div>
        ) : (
          <form onSubmit={submitElectronic} className="flex min-h-0 flex-1 flex-col">
            <div ref={bodyRef} className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
            <div className="flex items-center justify-between rounded-2xl border border-pasha-200 bg-pasha-50 p-3.5">
              <div className="flex items-center gap-2.5">
                <i className="fa-solid fa-boxes-packing text-lg text-pasha-600" />
                <span className="text-xs font-bold text-pasha-950">
                  {isQuote
                    ? 'عرض سعر مخصص حسب الكمية'
                    : `إجمالي الطلبية (${cartCount} قطعة شامل الضريبة)`}
                </span>
              </div>
              <span className="text-base font-bold text-pasha-700">
                {isQuote ? 'مخصص' : money(total, settings.currency)}
              </span>
            </div>

            {errors.cart && (
              <p className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-bold text-rose-600">
                {errors.cart}
              </p>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">
                  اسم المستلم *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={update('name')}
                  placeholder="مثال: أحمد العتيبي"
                  className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm transition focus:bg-white focus:outline-none ${
                    errors.name
                      ? 'border-rose-300 focus:border-rose-400'
                      : 'border-line focus:border-gold-500'
                  }`}
                />
                {errors.name && (
                  <p className="mt-1 text-[11px] font-semibold text-rose-500">{errors.name}</p>
                )}
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">
                  رقم الجوال للتواصل *
                </label>
                <input
                  type="tel"
                  inputMode="tel"
                  dir="ltr"
                  value={form.phone}
                  onChange={update('phone')}
                  placeholder="05XXXXXXXX"
                  className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-right text-sm transition focus:bg-white focus:outline-none ${
                    errors.phone
                      ? 'border-rose-300 focus:border-rose-400'
                      : 'border-line focus:border-gold-500'
                  }`}
                />
                {errors.phone && (
                  <p className="mt-1 text-[11px] font-semibold text-rose-500">{errors.phone}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">
                  اسم الشركة / المتجر (اختياري)
                </label>
                <input
                  type="text"
                  value={form.company}
                  onChange={update('company')}
                  placeholder="متجر الهدايا أو الشركة"
                  className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm transition focus:border-pasha-500 focus:bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">
                  المدينة / منطقة التوصيل *
                </label>
                <input
                  type="text"
                  value={form.city}
                  onChange={update('city')}
                  placeholder="اكتب المدينة، مثال: نابلس"
                  className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm transition focus:bg-white focus:outline-none ${
                    errors.city
                      ? 'border-rose-300 focus:border-rose-400'
                      : 'border-line focus:border-gold-500'
                  }`}
                />
                {errors.city && (
                  <p className="mt-1 text-[11px] font-semibold text-rose-500">{errors.city}</p>
                )}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700">
                {isQuote
                  ? 'عنوان التوصيل (اختياري)'
                  : 'العنوان التفصيلي للتوصيل *'}
              </label>
              <input
                type="text"
                value={form.address}
                onChange={update('address')}
                placeholder="الحي، الشارع، رقم المبنى..."
                className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm transition focus:bg-white focus:outline-none ${
                  errors.address
                    ? 'border-rose-300 focus:border-rose-400'
                    : 'border-line focus:border-gold-500'
                }`}
              />
              {errors.address && (
                <p className="mt-1 text-[11px] font-semibold text-rose-500">{errors.address}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700">
                ملاحظات إضافية (اختياري)
              </label>
              <textarea
                rows="2"
                value={form.notes}
                onChange={update('notes')}
                placeholder={
                  isQuote
                    ? 'اذكر الكميات المطلوبة وأي تغليف أو نقش خاص...'
                    : 'وقت التوصيل المناسب، تعليمات الوصول، أو أي طلب خاص...'
                }
                className="w-full resize-none rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm transition focus:border-pasha-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold text-slate-700">
                طريقة الدفع
              </label>
              <div className="flex items-center gap-3 rounded-2xl border border-gold-300 bg-gold-50/60 p-3.5">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-pasha-600 text-white">
                  <i className="fa-solid fa-hand-holding-dollar" />
                </span>
                <div className="flex-1">
                  <span className="block text-sm font-extrabold text-pasha-900">
                    الدفع عند الاستلام
                  </span>
                  <span className="block text-[11px] text-pasha-700/80">
                    {settings.payments}
                  </span>
                </div>
                <i className="fa-solid fa-circle-check text-lg text-pasha-600" />
              </div>
            </div>

            {!isQuote && (
              <div className="space-y-1.5 rounded-2xl border border-line bg-white p-4 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>المجموع الفرعي</span>
                  <span className="font-bold text-slate-700">
                    {money(subtotal, settings.currency)}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between rounded-lg bg-emerald-50 px-2 py-1 text-emerald-700">
                    <span>خصم الموسم ({discountRate}%)</span>
                    <span className="font-bold">- {money(discount, settings.currency)}</span>
                  </div>
                )}
                {!discount && entryTier && (
                  <p className="rounded-lg bg-gold-50 px-2 py-1 text-[10px] font-bold text-gold-800">
                    <i className="fa-solid fa-arrow-trend-up ml-1" />
                    أضف {money(Math.max(0, entryTier.threshold - subtotal), settings.currency)} للوصول إلى خصم {entryTier.percent}%
                  </p>
                )}
                <div className="flex justify-between text-slate-500">
                  <span>الضريبة ({settings.taxRate}%)</span>
                  <span className="font-bold text-slate-700">
                    {money(tax, settings.currency)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>التوصيل</span>
                  <span className="font-bold text-emerald-600">
                    {shipping ? money(shipping, settings.currency) : 'مجاني'}
                  </span>
                </div>
                <div className="flex justify-between border-t border-line pt-2 text-sm font-bold text-pasha-900">
                  <span>الإجمالي</span>
                  <span>{money(total, settings.currency)}</span>
                </div>
              </div>
            )}
            </div>

            <div className="border-t border-slate-100 bg-white p-4">
              <div className="rounded-2xl border border-dashed border-pasha-200 bg-white/60 p-3">
                <p className="mb-2 text-center text-[11px] font-bold text-slate-500">
                  اختر طريقة إتمام الطلب
                </p>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  <button
                    type="submit"
                    className="btn-shine flex items-center justify-center gap-2 rounded-xl bg-pasha-600 px-4 py-3 text-sm font-extrabold text-white shadow-md transition hover:bg-pasha-700 active:scale-[0.99]"
                  >
                    <i className="fa-solid fa-paper-plane" />
                    {isQuote ? 'إرسال طلب العرض سعر' : 'تأكيد الطلب إلكترونياً'}
                  </button>
                  <button
                    type="button"
                    onClick={submitWhatsApp}
                    className="flex items-center justify-center gap-2 rounded-xl border-2 border-emerald-500 bg-emerald-50 px-4 py-3 text-sm font-extrabold text-emerald-700 transition hover:bg-emerald-100 active:scale-[0.99]"
                  >
                    <i className="fa-brands fa-whatsapp text-lg" />
                    التواصل عبر واتساب
                  </button>
                </div>
              </div>

              <p className="mt-2 text-center text-[10px] leading-relaxed text-slate-400">
                بتأكيد الطلب أنت توافق على سياسة التوصيل والاستبدال لدى الباشا. سيتم
                التواصل معك هاتفياً أو عبر واتساب لتأكيد الموعد.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
