import { Link } from 'react-router-dom';
import Reveal from '../ui/Reveal';
import { useStore } from '../../store/StoreContext';
import { maxTierPercent } from '../../lib/discount';
import { money } from '../../lib/format';

export default function YearEndOffers() {
  const { offers, settings, subtotal, appliedTier, products } = useStore();
  const tiers = offers.tiers || [];

  if (!tiers.length) return null;

  const topPercent = maxTierPercent(tiers);
  const entryTier = tiers[0];
  const remaining = entryTier ? Math.max(0, entryTier.threshold - subtotal) : 0;

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <Reveal className="relative overflow-hidden rounded-2xl border border-gold-400/20 bg-gradient-to-br from-pasha-950 via-pasha-900 to-pasha-800 p-6 text-white shadow-xl sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gold-400/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/4 h-64 w-64 rounded-full bg-pasha-400/20 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.1),transparent_45%)]" />

        <div className="relative grid items-center gap-8 lg:grid-cols-12">
          <div className="space-y-3 lg:col-span-5">
            <span className="inline-flex items-center gap-2 rounded-full bg-gold-400 px-3 py-1 text-[11px] font-bold text-pasha-950">
              <i className="fa-solid fa-gift" />
              {offers.badge || 'عروض الموسم'}
            </span>
            <h2 className="text-2xl font-bold leading-tight sm:text-3xl">
              خصم الموسم يبدأ من {topPercent}%
            </h2>
            <p className="max-w-xl text-xs leading-relaxed text-pasha-100/90 sm:text-sm">
              يبدأ الخصم من {topPercent}% عند شراء{' '}
              {money(entryTier?.threshold || 350, settings.currency)}، ثم يُطبق على
              الشريحة المناسبة لقيمة طلبك — ويُحسب تلقائياً في السلة وإتمام الطلب
              بدون أي كود.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-bold">
              <span className="flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/10 px-2.5 py-1.5 text-pasha-100">
                <i className="fa-regular fa-calendar-days text-gold-300" />
                حتى {offers.endDate || '31 ديسمبر'}
              </span>
              <span className="flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/10 px-2.5 py-1.5 text-pasha-100">
                <i className="fa-solid fa-gem text-gold-300" />
                + سحب على طقم عطور فاخر
              </span>
            </div>

            {subtotal > 0 && (
              <div className="rounded-2xl border border-gold-300/30 bg-pasha-950/50 p-3 text-[11px]">
                {appliedTier ? (
                  <p className="flex items-center gap-2 font-bold text-emerald-300">
                    <i className="fa-solid fa-circle-check" />
                    خصمك الحالي {appliedTier.percent}% — وفرت{' '}
                    {money(Math.round((subtotal * appliedTier.percent) / 100), settings.currency)}
                  </p>
                ) : (
                  <p className="flex items-center gap-2 font-bold text-pasha-100">
                    <i className="fa-solid fa-arrow-trend-up text-gold-300" />
                    أضف {money(remaining, settings.currency)} للوصول إلى خصم{' '}
                    {entryTier?.percent || topPercent}%.
                  </p>
                )}
              </div>
            )}

            <div className="flex flex-wrap gap-2 pt-2">
              <a
                href="#catalog"
                className="btn-shine flex items-center gap-2 rounded-xl bg-gold-400 px-4 py-2.5 text-xs font-extrabold text-pasha-950 shadow transition hover:bg-gold-300"
              >
                <i className="fa-solid fa-cart-shopping" />
                تسوق واربح الخصم
              </a>
              <Link
                to="/offers"
                className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-white/20"
              >
                تفاصيل العروض
                <i className="fa-solid fa-arrow-left" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-5">
              {tiers.map((tier, index) => {
                const active = appliedTier?.threshold === tier.threshold;
                const reached = subtotal >= tier.threshold;
                return (
                  <div
                    key={`${tier.threshold}-${tier.percent}`}
                    className={`relative overflow-hidden rounded-xl border p-3 text-center transition duration-300 ${
                      active
                        ? 'border-gold-300 bg-gold-400 text-pasha-950 shadow-lg'
                        : reached
                          ? 'border-emerald-300/50 bg-emerald-400/15 text-emerald-100'
                          : 'border-white/15 bg-white/5 text-white hover:-translate-y-1 hover:border-gold-300/50 hover:bg-white/10'
                    }`}
                    style={{ animationDelay: `${index * 70}ms` }}
                  >
                    <span className="block text-[10px] font-bold opacity-70">
                      عند شراء
                    </span>
                    <span className="mt-0.5 block text-sm font-bold">
                      {money(tier.threshold, settings.currency)}
                    </span>
                    <span className="my-1.5 mx-auto block h-px w-8 bg-current opacity-20" />
                    <span className="block text-xl font-bold">{tier.percent}%</span>
                    <span className="block text-[9px] font-bold opacity-70">خصم</span>
                    {active && (
                      <i className="fa-solid fa-circle-check absolute left-1.5 top-1.5 text-[10px]" />
                    )}
                  </div>
                );
              })}
            </div>
            <p className="mt-3 text-[10px] leading-relaxed text-pasha-200/80">
              <i className="fa-solid fa-circle-info ml-1 text-gold-300" />
              {offers.yearEndNote}
            </p>
            <p className="mt-1.5 text-[10px] text-pasha-200/60">
              {products.length} منتجاً من العطور والعود والبخور ومستلزمات العناية.
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
