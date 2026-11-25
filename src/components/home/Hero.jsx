import { Link } from 'react-router-dom';
import Reveal from '../ui/Reveal';
import ProductArt from '../ui/ProductArt';
import { useStore } from '../../store/StoreContext';
import { maxTierPercent } from '../../lib/discount';

const STATS = [
  { value: '18', label: 'عطراً ومجموعة' },
  { value: '24–48', label: 'ساعة توصيل' },
  { value: '10%', label: 'خصم يبدأ من 350 ₪' },
  { value: 'COD', label: 'دفع عند الاستلام' },
];

export default function Hero() {
  const { products, offers } = useStore();
  const topPercent = maxTierPercent(offers.tiers || []) || 10;

  const stats = STATS.map((item) =>
    item.label.includes('خصم')
      ? { ...item, value: `${topPercent}%` }
      : item.label === 'عطراً ومجموعة'
        ? { ...item, value: String(products.length || 18) }
        : item,
  );

  return (
    <section className="hero-ornament relative overflow-hidden text-white" aria-labelledby="hero-title">
      <div className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full border border-gold-300/10" />
      <div className="pointer-events-none absolute -left-40 top-28 h-[520px] w-[520px] rounded-full border border-gold-300/10" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-pasha-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:px-8 lg:pb-24 lg:pt-20">
        <div className="grid items-center gap-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-gold-400" />
              <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-gold-300">
                Maison Al Pasha
              </span>
            </div>

            <h1
              id="hero-title"
              className="display mt-6 max-w-3xl text-4xl leading-[1.16] sm:text-5xl lg:text-[4.1rem]"
            >
              رائحةٌ تُذكر،
              <br />
              <span className="text-gold">وحضورٌ لا يُنسى</span>
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-loose text-pasha-100/80 sm:text-base">
              من الباشا للعطور — تشكيلة مختارة من العطور الشرقية والفرنسية، والعود
              المعتّق، والمسك النقي. كل زجاجة اختيرت لتكون توقيعك الخاص في كل مناسبة.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#catalog"
                className="btn-shine flex items-center gap-2 rounded-xl bg-gold-400 px-6 py-3.5 text-sm font-extrabold text-pasha-950 shadow-lift transition hover:bg-gold-300"
              >
                <i className="fa-solid fa-spray-can-sparkles" />
                تسوّق المجموعة
              </a>
              <Link
                to="/offers"
                className="flex items-center gap-2 rounded-xl border border-gold-300/40 px-6 py-3.5 text-sm font-bold text-gold-100 transition hover:border-gold-300 hover:bg-white/5"
              >
                استكشف العروض
                <i className="fa-solid fa-arrow-left" />
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-white/10 pt-6 sm:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="display text-2xl text-gold-200 sm:text-3xl">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-[11px] font-medium text-pasha-100/60">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={120} className="relative lg:col-span-5">
            <div className="relative mx-auto h-[340px] w-full max-w-sm sm:h-[420px]">
              <div className="absolute inset-0 rounded-[2.5rem] border border-gold-300/20" />
              <div className="absolute inset-4 rounded-[2rem] bg-gradient-to-b from-white/10 to-white/[0.02] backdrop-blur-sm" />

              <div className="absolute inset-x-8 top-16 bottom-16 flex items-center justify-center rounded-2xl border border-gold-200/50 bg-ivory p-6 shadow-lift">
                <ProductArt product={{ art: 'royalOud', name: 'Royal Oud' }} className="h-full w-full" />
              </div>

              <div className="absolute -left-2 top-6 h-36 w-28 animate-floatSlow rounded-2xl border border-gold-200/50 bg-pasha-50 p-3 shadow-lift sm:h-40 sm:w-32">
                <ProductArt product={{ art: 'rose', name: 'Taif Rose' }} className="h-full w-full" />
              </div>

              <div className="absolute -right-2 bottom-6 h-36 w-28 animate-float rounded-2xl border border-gold-200/50 bg-pasha-50 p-3 shadow-lift sm:h-40 sm:w-32">
                <ProductArt product={{ art: 'amber', name: 'Golden Amber' }} className="h-full w-full" />
              </div>

              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-gold-300/30 bg-pasha-950/80 px-4 py-1.5 text-[10px] font-bold tracking-[0.18em] text-gold-200">
                THE ART OF SCENT
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="relative border-t border-white/10 bg-pasha-950/40">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-4 py-3 text-[10px] font-bold tracking-wide text-pasha-100/60 sm:justify-between sm:px-6 lg:px-8">
          <span><i className="fa-solid fa-shield-halved ml-2 text-gold-400" /> أصالة مضمونة</span>
          <span><i className="fa-solid fa-truck-fast ml-2 text-gold-400" /> توصيل لجميع المدن</span>
          <span><i className="fa-solid fa-gift ml-2 text-gold-400" /> رقم سحب مع كل طلب</span>
          <span><i className="fa-brands fa-whatsapp ml-2 text-gold-400" /> تواصل مباشر</span>
        </div>
      </div>
    </section>
  );
}
