import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Reveal from '../components/ui/Reveal';
import { useStore } from '../store/StoreContext';
import { formatDate, money } from '../lib/format';

const REASONS = {
  empty: 'أدخل رقم السحب أولاً ثم اضغط «تسجيل المشاركة».',
  'not-found':
    'رقم السحب غير موجود. تأكد من كتابته كما وصل إليك بعد تأكيد الطلب (مثال: AP-G-123456).',
  quote: 'طلبات عروض السعر غير مشمولة بالسحب — السحب مخصصة لطلبات الشراء المؤكدة.',
  cancelled: 'هذا الطلب ملغى، لذلك لا يمكن تسجيله في السحب.',
};

export default function Raffle() {
  const { settings, enterRaffle, toast } = useStore();
  const raffle = settings.raffle;
  const [params] = useSearchParams();
  const [code, setCode] = useState(() => params.get('code') || '');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const winner = raffle?.winner;

  const submit = (event) => {
    event.preventDefault();
    const outcome = enterRaffle(code);
    if (!outcome.ok) {
      setResult(null);
      setError(REASONS[outcome.reason] || 'تعذّر تسجيل الرقم، حاول مرة أخرى.');
      return;
    }
    setError('');
    setResult(outcome);
    toast(
      outcome.already
        ? 'رقم السحب مسجل مسبقاً في السحب.'
        : 'تم تسجيل رقمك في سحب الباشا الذهبي بنجاح.',
      { type: 'success' },
    );
  };

  if (!raffle?.enabled) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <i className="fa-solid fa-ticket mb-4 block text-4xl text-slate-300" />
        <h1 className="text-2xl font-black text-slate-800">السحب غير متاحة حالياً</h1>
        <p className="mt-2 text-sm text-slate-500">
          تابعنا على واتساب أو فيسبوك لمعرفة موعد إطلاق السحب القادمة.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-pasha-600 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-pasha-700"
        >
          <i className="fa-solid fa-arrow-right" />
          العودة للمتجر
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-4 flex items-center gap-2 text-[11px] font-bold text-slate-400">
        <Link to="/" className="transition hover:text-pasha-600">
          الرئيسية
        </Link>
        <i className="fa-solid fa-angle-left text-[9px]" />
        <span className="text-pasha-700">سحب الباشا الذهبي</span>
      </nav>

      <Reveal className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pasha-950 via-pasha-900 to-amber-700 p-5 text-white shadow-xl sm:p-10">
        <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-amber-300/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 right-10 h-64 w-64 rounded-full bg-pasha-400/20 blur-3xl" />

        <div className="relative grid items-center gap-5 sm:gap-8 lg:grid-cols-12">
          <div className="space-y-3 lg:col-span-7">
            <span className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-3 py-1 text-[11px] font-black text-pasha-950">
              <i className="fa-solid fa-gem" />
              {raffle.prize}
            </span>
            <h1 className="text-2xl font-black leading-tight sm:text-4xl">
              {raffle.title}
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-pasha-100/90">
              {raffle.description}
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px] font-bold">
              <span className="flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/10 px-2.5 py-1.5">
                <i className="fa-regular fa-calendar-days text-amber-300" />
                موعد السحب: {raffle.drawDate}
              </span>
              <span className="flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/10 px-2.5 py-1.5">
                <i className="fa-solid fa-receipt text-amber-300" />
                كل طلب شراء = رقم سحب واحد
              </span>
            </div>
          </div>

          <div className="hidden lg:col-span-5 lg:block">
            <div className="relative mx-auto flex h-36 w-36 items-center justify-center rounded-full bg-gradient-to-br from-amber-200 via-yellow-100 to-amber-500 shadow-2xl shadow-amber-900/40">
              <div className="absolute inset-3 rounded-full border-2 border-dashed border-white/80" />
              <i className="fa-solid fa-gem animate-float text-5xl text-amber-800" />
            </div>
          </div>
        </div>
      </Reveal>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-12">
        <Reveal className="lg:col-span-7" delay={80}>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card sm:p-8">
            <h2 className="flex items-center gap-2 text-lg font-black text-slate-900">
              <i className="fa-solid fa-ticket text-amber-500" />
              سجّل رقم سحبك
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              اكتب رقم السحب الذي وصلك بعد تأكيد طلبك. الرقم يبدأ بـ{' '}
              <span className="font-mono font-bold text-pasha-700" dir="ltr">
                AP-G-
              </span>
            </p>

            <form onSubmit={submit} className="mt-5 space-y-3">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">
                  رقم السحب *
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={code}
                  onChange={(event) => {
                    setCode(event.target.value.toUpperCase());
                    setError('');
                  }}
                  placeholder="AP-G-123456"
                  className={`w-full rounded-2xl border-2 bg-slate-50 px-4 py-3.5 text-center font-mono text-lg font-black tracking-widest text-pasha-900 transition focus:bg-white focus:outline-none ${
                    error
                      ? 'border-rose-300 focus:border-rose-400'
                      : 'border-slate-200 focus:border-amber-400'
                  }`}
                />
              </div>

              {error && (
                <p className="animate-shake rounded-xl bg-rose-50 px-3.5 py-2.5 text-xs font-bold text-rose-600">
                  <i className="fa-solid fa-circle-exclamation ml-1" />
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="btn-shine flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-amber-500 to-amber-400 px-5 py-3.5 text-sm font-extrabold text-pasha-950 shadow-md transition hover:from-amber-600 hover:to-amber-500 active:scale-[0.99]"
              >
                <i className="fa-solid fa-check-to-slot" />
                تسجيل المشاركة في السحب
              </button>
            </form>

            {result && (
              <div
                className={`mt-5 animate-scaleIn rounded-2xl border p-4 ${
                  winner && winner.code === result.order.raffleCode
                    ? 'border-amber-300 bg-amber-50'
                    : result.already
                      ? 'border-sky-200 bg-sky-50'
                      : 'border-emerald-200 bg-emerald-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-lg text-emerald-600 shadow-sm">
                    <i
                      className={`fa-solid ${
                        result.already ? 'fa-circle-info text-sky-500' : 'fa-circle-check'
                      }`}
                    />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-sm font-extrabold text-slate-900">
                      {winner && winner.code === result.order.raffleCode
                        ? 'مبروك! رقمك هو الرقم الفائز'
                        : result.already
                          ? 'رقمك مسجل مسبقاً'
                          : 'تم تسجيل رقمك بنجاح'}
                    </h3>
                    <p className="mt-1 text-[11px] leading-relaxed text-slate-600">
                      {result.already
                        ? 'لا حاجة لإعادة التسجيل — رقمك محفوظ وسيدخل السحب تلقائياً.'
                        : 'احتفظ برقمك، وسيتم التواصل معك على رقم الجوال المسجل في الطلب إذا فزت.'}
                    </p>
                    <dl className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                      <div className="rounded-xl bg-white/80 px-3 py-2">
                        <dt className="text-slate-400">رقم السحب</dt>
                        <dd className="font-mono font-black text-pasha-800">
                          {result.order.raffleCode}
                        </dd>
                      </div>
                      <div className="rounded-xl bg-white/80 px-3 py-2">
                        <dt className="text-slate-400">رقم الطلب</dt>
                        <dd className="font-mono font-bold text-slate-700">
                          {result.order.id}
                        </dd>
                      </div>
                      <div className="rounded-xl bg-white/80 px-3 py-2">
                        <dt className="text-slate-400">الاسم</dt>
                        <dd className="font-bold text-slate-700">
                          {result.order.customer?.name}
                        </dd>
                      </div>
                      <div className="rounded-xl bg-white/80 px-3 py-2">
                        <dt className="text-slate-400">قيمة الطلب</dt>
                        <dd className="font-bold text-slate-700">
                          {money(result.order.total, settings.currency)}
                        </dd>
                      </div>
                    </dl>
                    {result.order.raffleEnteredAt && (
                      <p className="mt-2 text-[10px] text-slate-400">
                        تاريخ التسجيل: {formatDate(result.order.raffleEnteredAt)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </Reveal>

        <div className="space-y-5 lg:col-span-5">
          {winner && (
            <Reveal delay={120}>
              <div className="relative overflow-hidden rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-5 shadow-card">
                <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-amber-300/40 blur-2xl" />
                <span className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-3 py-1 text-[10px] font-black text-pasha-950">
                  <i className="fa-solid fa-trophy" /> نتيجة السحب
                </span>
                <h3 className="mt-3 text-lg font-black text-slate-900">
                  {winner.name}
                </h3>
                <p className="text-xs text-slate-500">
                  {winner.city} · {winner.code}
                </p>
                <p className="mt-2 text-[11px] text-slate-500">
                  تم السحب على {winner.entries} مشاركة — {formatDate(winner.drawnAt)}
                </p>
              </div>
            </Reveal>
          )}

          <Reveal delay={160}>
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-card">
              <h3 className="text-sm font-extrabold text-slate-900">
                كيف تحصل على رقم السحب؟
              </h3>
              <ol className="mt-3 space-y-3">
                {[
                  ['أضف منتجاتك للسلة', 'اختر من العطور والعود والبخور ومستلزمات العناية.'],
                  ['أكمل الطلب', 'أكد الطلب إلكترونياً أو عبر واتساب.'],
                  ['استلم رقمك', 'يظهر رقم السحب في شاشة نجاح الطلب وفي واتساب.'],
                  ['سجّل هنا', 'أدخل الرقم في هذه الصفحة ليُحفظ في السحب.'],
                ].map(([title, text], index) => (
                  <li key={title} className="flex items-start gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-pasha-50 text-[11px] font-black text-pasha-700">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{title}</p>
                      <p className="text-[11px] leading-relaxed text-slate-500">{text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className="rounded-3xl border border-amber-200 bg-amber-50/70 p-5 text-[11px] leading-relaxed text-amber-900">
              <h3 className="mb-2 flex items-center gap-2 text-xs font-extrabold">
                <i className="fa-solid fa-scale-balanced" /> شروط المشاركة
              </h3>
              <p>{raffle.terms}</p>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
