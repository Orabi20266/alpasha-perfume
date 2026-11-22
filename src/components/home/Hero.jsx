import { useNavigate } from 'react-router-dom';
import ProductArt from '../ui/ProductArt';
import Reveal from '../ui/Reveal';
import { useStore } from '../../store/StoreContext';
import { useUi } from '../../store/UiContext';
import { discountPercent, money } from '../../lib/format';
import { maxTierPercent } from '../../lib/discount';

export default function Hero() {
  const { settings, offers, products, addToCart, toast, cartCount } = useStore();
  const { openQuickView, openCheckout } = useUi();
  const navigate = useNavigate();

  const spotlight =
    products.find((p) => p.id === offers.spotlightProductId) ||
    products.find((p) => p.featured) ||
    products[0];

  const scrollCatalog = () =>
    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });

  const addSpotlight = () => {
    if (!spotlight) return;
    addToCart(spotlight.id);
    toast(`تمت إضافة "${spotlight.name}" إلى السلة`, {
      action: 'cart',
      type: 'success',
    });
  };

  const pct = spotlight ? discountPercent(spotlight.price, spotlight.oldPrice) : 0;
  const topTier = maxTierPercent(offers.tiers);

  return (
    <section className="relative overflow-hidden border-b-4 border-pasha-500 bg-blueprint-animated text-white">
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-pasha-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-1/3 h-80 w-80 rounded-full bg-pasha-400/15 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(12,142,230,0.18),transparent_60%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          <div className="space-y-4 text-right lg:col-span-7">
            <div className="inline-flex animate-fadeUp items-center gap-2 rounded-full border border-pasha-400/30 bg-pasha-900/90 px-3.5 py-1 text-xs font-bold text-pasha-200 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pasha-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-pasha-400" />
              </span>
              <span>{offers.heroBadge}</span>
            </div>

            <h1 className="animate-fadeUp text-2xl font-black leading-tight [animation-delay:80ms] sm:text-4xl lg:text-[2.7rem]">
              {offers.heroTitle.split('الباشا').map((part, index) =>
                index === 0 ? (
                  <span key={`part-${index}`}>{part}</span>
                ) : (
                  <span key={`part-${index}`}>
                    <span className="bg-gradient-to-l from-pasha-300 to-white bg-clip-text text-transparent underline decoration-pasha-500 decoration-4 underline-offset-8">
                      الباشا
                    </span>
                    {part}
                  </span>
                ),
              )}
            </h1>

            <p className="max-w-2xl animate-fadeUp text-sm font-normal leading-relaxed text-pasha-100/90 [animation-delay:160ms] sm:text-base">
              {offers.heroText}
            </p>

            <div className="flex animate-fadeUp flex-wrap items-center gap-3 pt-1 [animation-delay:240ms]">
              <button
                type="button"
                onClick={scrollCatalog}
                className="btn-shine flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-xs font-extrabold text-pasha-900 shadow-md transition hover:-translate-y-0.5 hover:bg-pasha-50 sm:text-sm"
              >
                <i className="fa-solid fa-layer-group text-pasha-600" />
                استعراض المنتجات
              </button>
              <button
                type="button"
                onClick={() => navigate('/offers')}
                className="flex items-center gap-2 rounded-xl border border-pasha-400/40 bg-pasha-800/80 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-pasha-700 sm:text-sm"
              >
                <i className="fa-solid fa-tags text-pasha-300" />
                عروض الموسم
              </button>
              <button
                type="button"
                onClick={() => openCheckout('quote')}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs font-bold text-pasha-200 underline-offset-4 transition hover:border-white/20 hover:bg-white/10 hover:text-white sm:text-sm"
              >
                <i className="fa-solid fa-file-invoice-dollar" />
                عرض سعر خاص
              </button>
            </div>

            <div className="grid animate-fadeUp grid-cols-2 gap-3 pt-3 text-xs sm:grid-cols-4 [animation-delay:320ms]">
              {[
                { icon: 'fa-layer-group', value: 'عود ودهن عود', label: 'أصلي ومضمون' },
                { icon: 'fa-truck-fast', value: '24-48 ساعة', label: 'توصيل سريع' },
                { icon: 'fa-hand-holding-dollar', value: 'عند الاستلام', label: 'طريقة الدفع' },
                { icon: 'fa-headset', value: 'استشارة عطرية', label: 'اختيار مجاني' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 backdrop-blur-sm transition hover:bg-white/10"
                >
                  <i className={`fa-solid ${item.icon} mb-1 block text-pasha-300`} />
                  <span className="block text-[13px] font-extrabold">{item.value}</span>
                  <span className="block text-[10px] text-pasha-200/80">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <Reveal className="lg:col-span-5" delay={120}>
            {spotlight ? (
              <div className="relative rounded-3xl border border-white/15 bg-gradient-to-br from-white/10 to-white/5 p-4 shadow-xl backdrop-blur-md sm:p-5">
                <div className="absolute -left-3 -top-3 flex items-center gap-1.5 rounded-xl bg-amber-400 px-2.5 py-1 text-[10px] font-black text-pasha-950 shadow-lg">
                  <i className="fa-solid fa-bolt" />
                  {offers.badge}
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <span className="inline-block rounded-md bg-pasha-500/30 px-2 py-0.5 text-[10px] font-bold text-pasha-100">
                      خصم الموسم حتى {topTier}%
                    </span>
                    <h3 className="line-clamp-2 text-base font-extrabold text-white sm:text-lg">
                      {spotlight.name}
                    </h3>
                    <p className="line-clamp-1 text-xs text-pasha-200">
                      {spotlight.specs?.[0]}
                    </p>
                    <div className="flex items-baseline gap-2 pt-1">
                      <span className="text-xl font-black text-pasha-300">
                        {money(spotlight.price, settings.currency)}
                      </span>
                      {spotlight.oldPrice ? (
                        <span className="text-xs text-slate-400 line-through">
                          {money(spotlight.oldPrice, settings.currency)}
                        </span>
                      ) : null}
                      {pct > 0 && (
                        <span className="rounded-md bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-bold text-emerald-300">
                          -{pct}%
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                      <button
                        type="button"
                        onClick={addSpotlight}
                        className="btn-shine flex items-center gap-1.5 rounded-xl bg-pasha-500 px-3.5 py-2 text-xs font-bold text-white shadow transition hover:bg-pasha-400 active:scale-95"
                      >
                        <i className="fa-solid fa-cart-plus" /> أضف للسلة
                      </button>
                      <button
                        type="button"
                        onClick={() => openQuickView(spotlight.id)}
                        className="rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/20"
                      >
                        المواصفات
                      </button>
                      {cartCount > 0 && (
                        <span className="mr-auto hidden items-center gap-1 text-[10px] text-pasha-200 sm:flex">
                          <i className="fa-solid fa-cart-shopping" /> {cartCount}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => openQuickView(spotlight.id)}
                    aria-label={`عرض ${spotlight.name}`}
                    className="group relative flex h-28 w-28 shrink-0 cursor-pointer items-center justify-center rounded-2xl bg-white p-2 shadow-inner sm:h-32 sm:w-32"
                  >
                    {spotlight.oldPrice && (
                      <span className="absolute right-1.5 top-1.5 z-10 rounded bg-pasha-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                        -{pct}%
                      </span>
                    )}
                    <div className="h-full w-full animate-floatSlow transition-transform group-hover:scale-105">
                      <ProductArt product={spotlight} className="h-full w-full" />
                    </div>
                  </button>
                </div>

                <div className="mt-3 flex items-center justify-between rounded-xl border border-white/10 bg-pasha-950/40 px-3 py-2 text-[10px] text-pasha-200">
                  <span className="flex items-center gap-1.5">
                    <i className="fa-solid fa-truck-fast text-pasha-400" />
                    توصيل مجاني للطلبات فوق{' '}
                    {money(settings.freeShippingThreshold, settings.currency)}
                  </span>
                  <span className="flex items-center gap-1.5 font-bold text-emerald-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    متوفر الآن
                  </span>
                </div>
              </div>
            ) : (
              <div className="rounded-3xl border border-white/15 bg-white/5 p-10 text-center text-sm text-pasha-200">
                تواصل معنا على واتساب لمعرفة أحدث العروضات والمنتجات المتوفرة.
              </div>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
