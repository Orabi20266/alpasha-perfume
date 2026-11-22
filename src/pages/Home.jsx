import Catalog from '../components/home/Catalog';
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
    <div className="overflow-hidden border-b border-slate-200 bg-white py-3">
      <div className="flex w-max animate-marquee items-center gap-10 hover:[animation-play-state:paused]">
        {items.map((item, index) => (
          <span
            key={`${item.text}-${index}`}
            className="flex shrink-0 items-center gap-2 text-xs font-bold text-slate-500"
          >
            <i className={`fa-solid ${item.icon} text-pasha-500`} />
            {item.text}
            <span className="mr-8 h-1 w-1 rounded-full bg-pasha-200" />
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const { settings } = useStore();

  return (
    <>
      <Catalog />
      <TrustTicker />
      <YearEndOffers />
      <DealsSection />
      <RaffleSection />
      <WhyUs />
      <Testimonials />

      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 rounded-3xl border border-pasha-100 bg-gradient-to-l from-pasha-50 to-white p-6 text-center sm:flex-row sm:text-right">
          <div>
            <h3 className="text-lg font-black text-pasha-950">
              جاهز تختار عطرك المميز مع الباشا؟
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              اطلب الآن أو راسلنا على واتساب{' '}
              <span dir="ltr" className="font-bold text-emerald-600">
                {settings.whatsappDisplay}
              </span>{' '}
              — والدفع عند الاستلام.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/${settings.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="btn-shine flex items-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-extrabold text-white shadow transition hover:bg-emerald-600"
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
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-[#1877f2] transition hover:bg-pasha-50"
              >
                <i className="fa-brands fa-facebook-f" />
              </a>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
