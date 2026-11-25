import Catalog from '../components/home/Catalog';
import Hero from '../components/home/Hero';
import YearEndOffers from '../components/home/YearEndOffers';
import DealsSection from '../components/home/DealsSection';
import RaffleSection from '../components/home/RaffleSection';
import WhyUs from '../components/home/WhyUs';
import Testimonials from '../components/home/Testimonials';
import { useStore } from '../store/StoreContext';

const TICKER = [
  { icon: 'fa-spray-can-sparkles', text: 'عطور شرقية وفرنسية فاخرة' },
  { icon: 'fa-percent', text: 'عروض الموسم — خصم يبدأ من 10% عند 350 ₪' },
  { icon: 'fa-gift', text: 'سحب على طقم عطور فاخر مع كل طلب' },
  { icon: 'fa-hand-holding-dollar', text: 'الدفع عند الاستلام' },
  { icon: 'fa-truck-fast', text: 'توصيل لجميع المدن خلال 24-48 ساعة' },
  { icon: 'fa-leaf', text: 'عود ودهن عود أصلي ومضمون' },
];

function TrustTicker() {
  const items = [...TICKER, ...TICKER];
  return (
    <div className="overflow-hidden border-y border-line bg-white py-3.5">
      <div className="flex w-max animate-marquee items-center hover:[animation-play-state:paused]">
        {items.map((item, index) => (
          <span
            key={`${item.text}-${index}`}
            className="flex shrink-0 items-center gap-2.5 text-[11px] font-bold text-slate-500"
          >
            <i className={`fa-solid ${item.icon} text-gold-600`} />
            {item.text}
            <span className="mx-7 h-1 w-1 rotate-45 bg-gold-300" />
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const { settings } = useStore();

  return (
    <main>
      <Hero />
      <Catalog />
      <TrustTicker />
      <YearEndOffers />
      <DealsSection />
      <RaffleSection />
      <WhyUs />
      <Testimonials />

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-gold-300/30 bg-pasha-950 px-6 py-8 text-white shadow-lift sm:px-10 sm:py-10">
          <span className="pointer-events-none absolute -left-16 -top-20 h-56 w-56 rounded-full border border-gold-300/10" />
          <span className="pointer-events-none absolute -bottom-24 right-0 h-64 w-64 rounded-full bg-pasha-500/20 blur-3xl" />
          <div className="relative flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-right">
            <div>
              <span className="section-eyebrow text-gold-300">اختر توقيعك</span>
              <h3 className="display mt-2 text-2xl text-white sm:text-3xl">
                جاهز تختار عطرك المميز؟
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-pasha-100/70 sm:text-sm">
                اطلب الآن أو راسلنا على واتساب{' '}
                <span dir="ltr" className="font-bold text-gold-200">
                  {settings.whatsappDisplay}
                </span>
                — والدفع عند الاستلام.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={`https://wa.me/${settings.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="btn-shine flex items-center gap-2 rounded-xl bg-gold-400 px-5 py-3 text-sm font-extrabold text-pasha-950 transition hover:bg-gold-300"
              >
                <i className="fa-brands fa-whatsapp text-lg" />
                راسلنا على واتساب
              </a>
              {settings.social?.facebook && (
                <a
                  href={settings.social.facebook}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="صفحة فيسبوك"
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 text-gold-200 transition hover:bg-white/10"
                >
                  <i className="fa-brands fa-facebook-f" />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
