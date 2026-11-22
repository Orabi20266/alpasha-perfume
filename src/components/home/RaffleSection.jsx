import { Link } from 'react-router-dom';
import Reveal from '../ui/Reveal';
import { useStore } from '../../store/StoreContext';

export default function RaffleSection() {
  const { settings } = useStore();
  const raffle = settings.raffle;

  if (!raffle?.enabled) return null;

  const winner = raffle.winner;

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <Reveal className="relative overflow-hidden rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-pasha-50 p-6 shadow-card sm:p-8">
        <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-amber-300/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 right-8 h-56 w-56 rounded-full bg-pasha-300/20 blur-3xl" />

        <div className="relative grid items-center gap-6 md:grid-cols-12">
          <div className="md:col-span-3">
            <div className="relative mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 via-yellow-200 to-amber-500 shadow-lg shadow-amber-200/70">
              <div className="absolute inset-2 rounded-full border-2 border-dashed border-white/70" />
              <i className="fa-solid fa-gem animate-float text-4xl text-amber-800" />
              <span className="absolute -bottom-2 rounded-full bg-pasha-950 px-3 py-1 text-[10px] font-black text-amber-300 shadow">
                {raffle.prize}
              </span>
            </div>
          </div>

          <div className="space-y-2 text-center md:col-span-6 md:text-right">
            <span className="inline-flex items-center gap-2 rounded-full bg-pasha-950 px-3 py-1 text-[11px] font-black text-amber-300">
              <i className="fa-solid fa-ticket" />
              سحب كل المشترين
            </span>
            <h2 className="text-xl font-black text-slate-900 sm:text-2xl">
              {raffle.title}
            </h2>
            <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">
              {raffle.description}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-[11px] font-bold text-slate-500 md:justify-start">
              <span className="flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1.5 ring-1 ring-amber-200">
                <i className="fa-regular fa-calendar-days text-amber-600" />
                السحب: {raffle.drawDate}
              </span>
              <span className="flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1.5 ring-1 ring-amber-200">
                <i className="fa-solid fa-receipt text-amber-600" />
                كل طلب = رقم سحب
              </span>
            </div>
          </div>

          <div className="space-y-2 md:col-span-3">
            <Link
              to="/raffle"
              className="btn-shine flex w-full items-center justify-center gap-2 rounded-2xl bg-pasha-700 px-5 py-3 text-sm font-extrabold text-white shadow-md transition hover:bg-pasha-800"
            >
              <i className="fa-solid fa-ticket" />
              أدخل رقم السحب
            </Link>
            <p className="text-center text-[10px] leading-relaxed text-slate-400">
              رقم السحب يصلك بعد تأكيد طلبك مباشرة.
            </p>
            {winner && (
              <div className="animate-fadeIn rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-center text-[11px] font-bold text-emerald-700">
                <i className="fa-solid fa-trophy ml-1" />
                الفائز: {winner.name} — {winner.code}
              </div>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
