import { useStore } from '../../store/StoreContext';
import { waLink } from '../../lib/format';

export default function AnnouncementBar() {
  const { settings, offers } = useStore();

  return (
    <div className="relative overflow-hidden border-b border-pasha-800/60 bg-pasha-950 px-4 py-2 text-[10px] text-white sm:text-[13px]">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-4">
          <span className="flex items-center gap-1.5 font-medium text-pasha-300">
            <i className="fa-solid fa-truck-fast animate-pulse text-pasha-400" />
            <span className="truncate">{offers.announcement || settings.announcement}</span>
          </span>
          <span className="hidden text-pasha-700 md:inline-block">|</span>
          <span className="hidden items-center gap-1.5 text-slate-300 md:flex">
            <i className="fa-solid fa-hand-holding-dollar text-pasha-400" />
            {settings.payments}
          </span>
        </div>

        <div className="mr-auto flex items-center gap-3 sm:mr-0 sm:gap-4">
          <a
            href={waLink(settings.whatsapp)}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 font-semibold text-emerald-300 transition hover:text-white"
          >
            <i className="fa-brands fa-whatsapp text-base" />
            <span dir="ltr">{settings.whatsappDisplay}</span>
          </a>
          <span className="hidden text-pasha-700 sm:inline">|</span>
          {settings.social?.facebook && (
            <a
              href={settings.social.facebook}
              target="_blank"
              rel="noreferrer"
              aria-label="صفحة الباشا على فيسبوك"
              className="hidden items-center gap-1 text-slate-300 transition hover:text-pasha-300 sm:flex"
            >
              <i className="fa-brands fa-facebook-f" />
              <span>فيسبوك</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
