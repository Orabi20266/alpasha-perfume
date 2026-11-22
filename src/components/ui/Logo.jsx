import { Link } from 'react-router-dom';

export default function Logo({ compact = false, dark = false }) {
  return (
    <Link
      to="/"
      className="group flex items-center gap-3"
      aria-label="AL PASHA — الباشا للعطور"
    >
      <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-pasha-600 via-pasha-800 to-pasha-950 text-white shadow-md transition-all duration-300 group-hover:shadow-glow">
        <svg
          className="h-8 w-8"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <rect x="15" y="4" width="10" height="4" rx="1.5" fill="#eac455" />
          <rect x="17" y="8" width="6" height="5" fill="#d4911d" />
          <path
            d="M12 13H28L31 33C31 35.2 29.2 37 27 37H13C10.8 37 9 35.2 9 33L12 13Z"
            fill="rgba(255,255,255,0.12)"
            stroke="#eac455"
            strokeWidth="1.6"
          />
          <rect x="15" y="21" width="10" height="10" rx="1.5" fill="#f9efc9" opacity="0.92" />
          <text
            x="20"
            y="29"
            textAnchor="middle"
            fill="#3d0d22"
            fontSize="6"
            fontWeight="900"
            fontFamily="Cairo"
          >
            AP
          </text>
          <circle cx="20" cy="11" r="1.2" fill="#eac455" />
        </svg>
        <span className="absolute -bottom-1 -left-1 rounded-md bg-gold-400 px-1.5 text-[10px] font-black text-pasha-950 shadow">
          LUXE
        </span>
      </div>
      {!compact && (
        <div>
          <div className="flex items-center gap-1.5">
            <span
              className={`font-messiri text-xl font-black tracking-wider sm:text-2xl ${
                dark
                  ? 'bg-gradient-to-l from-white via-gold-200 to-gold-400 bg-clip-text text-transparent'
                  : 'text-gradient'
              }`}
            >
              AL PASHA
            </span>
            <span
              className={`hidden rounded-full border px-2 py-0.5 text-[10px] font-bold sm:inline-block ${
                dark
                  ? 'border-gold-400/40 bg-white/10 text-gold-200'
                  : 'border-pasha-200 bg-pasha-50 text-pasha-700'
              }`}
            >
              للعطور
            </span>
          </div>
          <p
            className={`-mt-1 text-[10px] font-medium sm:text-[11px] ${
              dark ? 'text-gold-200/80' : 'text-slate-500'
            }`}
          >
            <span className="sm:hidden">عطور شرقية وفرنسية</span>
            <span className="hidden sm:inline">
              الباشا للعطور · عطور شرقية وفرنسية فاخرة
            </span>
          </p>
        </div>
      )}
    </Link>
  );
}
