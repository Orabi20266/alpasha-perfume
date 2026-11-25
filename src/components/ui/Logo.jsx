import { Link } from 'react-router-dom';

export default function Logo({ compact = false, dark = false }) {
  return (
    <Link
      to="/"
      className="group flex items-center gap-3"
      aria-label="AL PASHA — الباشا للعطور"
    >
      <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gold-400/60 bg-pasha-950 shadow-card transition-all duration-300 group-hover:border-gold-300 group-hover:shadow-glow">
        <span className={`display text-lg tracking-[0.12em] ${dark ? 'text-gold' : 'text-gold'}`}>
          AP
        </span>
        <span className="absolute bottom-1.5 h-px w-6 bg-gold-400/70" />
      </span>

      {!compact && (
        <span className="block">
          <span className="flex items-center gap-2">
            <span
              className={`display text-lg tracking-[0.2em] sm:text-xl ${
                dark ? 'text-gold' : 'text-gradient'
              }`}
            >
              AL PASHA
            </span>
            <span
              className={`rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-wide ${
                dark
                  ? 'border-gold-400/40 text-gold-200'
                  : 'border-gold-300 bg-gold-50 text-gold-700'
              }`}
            >
              للعطور
            </span>
          </span>
          <span
            className={`mt-0.5 block text-[10px] font-medium tracking-[0.08em] ${
              dark ? 'text-gold-200/70' : 'text-slate-500'
            }`}
          >
            <span className="sm:hidden">عطور شرقية وفرنسية</span>
            <span className="hidden sm:inline">عطور شرقية وفرنسية فاخرة</span>
          </span>
        </span>
      )}
    </Link>
  );
}
