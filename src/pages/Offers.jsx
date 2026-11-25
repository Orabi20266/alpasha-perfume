import { Link } from 'react-router-dom';
import ProductCard from '../components/home/ProductCard';
import Reveal from '../components/ui/Reveal';
import { useStore } from '../store/StoreContext';
import { money, waLink } from '../lib/format';
import { maxTierPercent } from '../lib/discount';

export default function Offers() {
  const { offers, products, settings } = useStore();
  const tiers = offers.tiers || [];
  const topPercent = maxTierPercent(tiers);

  const offerProducts = (offers.productIds || [])
    .map((id) => products.find((product) => product.id === id))
    .filter(Boolean);
  const fallback = products.filter(
    (product) => product.oldPrice && product.oldPrice > product.price,
  );
  const list = offerProducts.length ? offerProducts : fallback;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-4 flex items-center gap-2 text-[11px] font-bold text-slate-400">
        <Link to="/" className="transition hover:text-pasha-600">
          الرئيسية
        </Link>
        <i className="fa-solid fa-angle-left text-[9px]" />
        <span className="text-pasha-700">العروضات</span>
      </nav>

      <Reveal className="relative overflow-hidden rounded-2xl border border-gold-400/20 bg-gradient-to-br from-pasha-950 via-pasha-800 to-pasha-600 p-6 text-white shadow-xl sm:p-10">
        <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-pasha-400/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 right-10 h-64 w-64 rounded-full bg-gold-400/10 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_45%)]" />

        <div className="relative grid items-center gap-6 lg:grid-cols-12">
          <div className="space-y-3 lg:col-span-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-gold-400 px-3 py-1 text-[11px] font-extrabold text-pasha-950">
              <i className="fa-solid fa-bolt" />
              {offers.badge}
            </span>
            <h1 className="display text-3xl leading-tight text-white sm:text-5xl">
              {offers.title}
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-pasha-100/90">
              {offers.subtitle}
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href={waLink(
                  settings.whatsapp,
                  `مرحباً الباشا، أرغب بالاستفادة من ${offers.title} وخصم الموسم حتى ${topPercent}%.`,
                )}
                target="_blank"
                rel="noreferrer"
                className="btn-shine flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-extrabold text-white shadow transition hover:bg-emerald-600 sm:text-sm"
              >
                <i className="fa-brands fa-whatsapp text-lg" />
                اطلب العرض عبر واتساب
              </a>
              <span className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-bold text-pasha-100">
                <i className="fa-solid fa-hand-holding-dollar text-pasha-300" />
                الدفع عند الاستلام
              </span>
              <span className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-bold text-pasha-100">
                <i className="fa-solid fa-gem text-gold-300" />
                سحب الباشا الذهبي
              </span>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-pasha-200">
                  خصم الموسم
                </span>
                <span className="rounded-full bg-gold-400 px-2.5 py-0.5 text-[10px] font-extrabold text-pasha-950">
                  حتى {topPercent}%
                </span>
              </div>

              <div className="mt-3 space-y-1.5">
                {tiers.map((tier) => (
                  <div
                    key={`${tier.threshold}-${tier.percent}`}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-pasha-950/35 px-3 py-2"
                  >
                    <span className="text-[11px] font-bold text-pasha-100">
                      {money(tier.threshold, settings.currency)}+
                    </span>
                    <span className="display text-xl text-gold-300">
                      {tier.percent}%
                    </span>
                  </div>
                ))}
              </div>

              <p className="mt-3 border-t border-white/10 pt-2 text-[10px] leading-relaxed text-pasha-200/80">
                {offers.yearEndNote}
              </p>
              <div className="mt-3 border-t border-white/10 pt-2 text-[10px] text-pasha-200/80">
                {list.length} منتجاً مشمولاً بالعرض
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal className="mt-4 flex flex-col items-center justify-between gap-3 rounded-xl border border-gold-200 bg-gradient-to-l from-gold-50 to-white p-4 sm:flex-row">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-300 to-gold-500 text-xl text-pasha-950 shadow">
            <i className="fa-solid fa-gem" />
          </span>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">
              {settings.raffle?.title || 'سحب الباشا الذهبي'}
            </h3>
            <p className="text-[11px] text-slate-500">
              كل طلب شراء يحصل على رقم سحب — أدخل رقمك للمشاركة في السحب على{' '}
              {settings.raffle?.prize || 'طقم عطور فاخر'}.
            </p>
          </div>
        </div>
        <Link
          to="/raffle"
          className="flex shrink-0 items-center gap-2 rounded-xl bg-pasha-900 px-4 py-2.5 text-xs font-extrabold text-gold-100 transition hover:bg-pasha-900"
        >
          <i className="fa-solid fa-ticket" />
          صفحة السحب
        </Link>
      </Reveal>

      <div className="mb-5 mt-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="display text-2xl text-ink sm:text-3xl">
            المنتجات المشمولة بالعرض
          </h2>
          <p className="text-xs text-slate-500">
            الكميات محدودة — الأسعار بالـ{settings.currencyName} وتشمل الضريبة،
            ويُضاف إليها خصم الموسم تلقائياً في السلة.
          </p>
        </div>
        <Link
          to="/"
          className="flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2 text-xs font-bold text-slate-600 transition hover:border-gold-300 hover:text-gold-700"
        >
          <i className="fa-solid fa-arrow-right" />
          العودة للمتجر
        </Link>
      </div>

      {list.length ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((product, index) => (
            <Reveal key={product.id} delay={Math.min(index, 8) * 60}>
              <ProductCard product={product} index={index} />
            </Reveal>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-line bg-white p-12 text-center shadow-card">
          <i className="fa-solid fa-tags mb-3 text-3xl text-pasha-300" />
          <h3 className="text-lg font-extrabold text-slate-800">لا توجد عروضات حالياً</h3>
          <p className="mt-1 text-xs text-slate-500">
            تابع هذه الصفحة قريباً، أو تواصل معنا على واتساب للحصول على عرض مخصص.
          </p>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { icon: 'fa-cart-plus', title: 'أضف منتجاتك للسلة', text: 'اختر من العطور والعود والبخور ومستلزمات العناية المشمولة بالعرض.' },
          { icon: 'fa-percent', title: 'اختر شريحتك', text: 'يُطبق خصم الموسم تلقائياً حسب قيمة سلتك، بدءاً من 10% عند 350 ₪.' },
          { icon: 'fa-ticket', title: 'استلم رقم السحب', text: 'أكمل الطلب واستلم رقمك الخاص للمشاركة في سحب الباشا الذهبي.' },
        ].map((step, index) => (
          <Reveal
            key={step.title}
            delay={index * 100}
            className="rounded-xl border border-line bg-white p-4 shadow-card"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gold-50 text-gold-700">
              <i className={`fa-solid ${step.icon}`} />
            </div>
            <h4 className="text-sm font-extrabold text-slate-800">{step.title}</h4>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-500">{step.text}</p>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
