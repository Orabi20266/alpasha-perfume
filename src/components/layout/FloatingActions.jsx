import { useEffect, useState } from 'react';
import { useStore } from '../../store/StoreContext';
import { waLink } from '../../lib/format';

export default function FloatingActions() {
  const { settings } = useStore();
  const [showTop, setShowTop] = useState(false);
  const [showTip, setShowTip] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 500);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowTip(true), 2600);
    const hide = setTimeout(() => setShowTip(false), 9000);
    return () => {
      clearTimeout(timer);
      clearTimeout(hide);
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-center gap-2 sm:bottom-6 sm:right-6 sm:gap-3">
      {showTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="العودة للأعلى"
          className="hidden h-10 w-10 animate-scaleIn items-center justify-center rounded-full border border-line bg-white text-slate-500 shadow-card transition hover:border-gold-300 hover:text-gold-700 sm:flex"
        >
          <i className="fa-solid fa-arrow-up text-xs sm:text-sm" />
        </button>
      )}

      <div className="relative">
        {showTip && (
          <div className="absolute bottom-1 right-14 hidden w-max max-w-[168px] animate-fadeIn rounded-2xl rounded-bl-sm bg-white p-3 text-right text-[11px] font-bold text-slate-700 shadow-xl ring-1 ring-slate-100 sm:right-16 sm:block sm:max-w-[190px]">
            محتاج مساعدة؟ راسلنا على واتساب
            <button
              type="button"
              onClick={() => setShowTip(false)}
              aria-label="إخفاء التنبيه"
              className="absolute -left-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-[9px] text-slate-600"
            >
              <i className="fa-solid fa-xmark" />
            </button>
          </div>
        )}
        <a
          href={waLink(
            settings.whatsapp,
            'مرحباً الباشا، أرغب بالاستفسار عن العطور والعود والبخور المتوفرة لديكم.',
          )}
          target="_blank"
          rel="noreferrer"
          aria-label="تواصل معنا على واتساب"
          onMouseEnter={() => setShowTip(false)}
          className="group flex h-12 w-12 animate-pulseRing items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-xl transition hover:scale-105 hover:shadow-2xl sm:h-14 sm:w-14"
        >
          <i className="fa-brands fa-whatsapp text-2xl sm:text-3xl" />
          <span className="absolute inset-0 rounded-full ring-2 ring-emerald-300/40" />
        </a>
      </div>
    </div>
  );
}
