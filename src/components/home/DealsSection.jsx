import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import Reveal from '../ui/Reveal';
import { useStore } from '../../store/StoreContext';
import { maxTierPercent } from '../../lib/discount';

export default function DealsSection() {
  const { products, offers, settings } = useStore();

  const dealProducts = (offers.productIds || [])
    .map((id) => products.find((product) => product.id === id))
    .filter(Boolean)
    .filter((product) => product.oldPrice && product.oldPrice > product.price)
    .slice(0, 4);

  if (!dealProducts.length) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8">
      <Reveal className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-extrabold text-amber-700 ring-1 ring-amber-200">
            <i className="fa-solid fa-bolt animate-pulse" />
            {offers.badge}
          </span>
          <h2 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">
            {offers.title}
          </h2>
          <p className="mt-1 max-w-2xl text-xs leading-relaxed text-slate-500 sm:text-sm">
            {offers.subtitle}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-2 rounded-xl border border-dashed border-amber-300 bg-amber-50 px-3 py-2 text-[11px] font-bold text-amber-800 sm:flex">
            <i className="fa-solid fa-percent text-amber-600" />
            خصم تلقائي حتى {maxTierPercent(offers.tiers)}%
          </span>
          <Link
            to="/offers"
            className="btn-shine flex items-center gap-2 rounded-2xl bg-pasha-700 px-4 py-2.5 text-xs font-extrabold text-white shadow transition hover:bg-pasha-800"
          >
            كل العروضات
            <i className="fa-solid fa-arrow-left" />
          </Link>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        {dealProducts.map((product, index) => (
          <Reveal key={product.id} delay={index * 80}>
            <ProductCard product={product} index={index} />
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-pasha-100 bg-pasha-50/60 px-4 py-3 text-xs font-semibold text-pasha-900">
        <span className="flex items-center gap-2">
          <i className="fa-solid fa-truck-fast text-pasha-600" />
          توصيل مجاني للطلبات فوق {settings.freeShippingThreshold.toLocaleString('en-US')}{' '}
          {settings.currency} — والدفع عند الاستلام في كل الطلبات.
        </span>
        <span className="flex items-center gap-2 text-emerald-700">
          <i className="fa-solid fa-shield-halved" />
          ضمان أصالة على كافة العطور
        </span>
      </Reveal>
    </section>
  );
}
