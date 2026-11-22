import { useStore } from '../../store/StoreContext';
import { useUi } from '../../store/UiContext';

const ICONS = {
  success: 'fa-check',
  info: 'fa-circle-info',
  error: 'fa-triangle-exclamation',
};

const TONES = {
  success: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30',
  info: 'bg-pasha-500/20 text-pasha-200 border-pasha-400/30',
  error: 'bg-rose-500/15 text-rose-300 border-rose-400/30',
};

export default function ToastHost() {
  const { toasts, dismissToast } = useStore();
  const { openCart } = useUi();

  return (
    <div className="pointer-events-none fixed bottom-24 left-5 right-5 z-[90] flex max-w-sm flex-col gap-2.5 sm:left-auto">
      {toasts.map((item) => (
        <div
          key={item.id}
          role="status"
          className="pointer-events-auto animate-fadeUp overflow-hidden rounded-2xl border border-white/10 bg-pasha-950/95 text-white shadow-2xl backdrop-blur"
        >
          <div className="flex items-center justify-between gap-3 p-4">
            <div className="flex items-start gap-3">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border ${TONES[item.type] || TONES.success}`}
              >
                <i className={`fa-solid ${ICONS[item.type] || ICONS.success} text-sm`} />
              </div>
              <span className="text-xs font-bold leading-relaxed">
                {item.message}
              </span>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              {item.action === 'cart' && (
                <button
                  type="button"
                  onClick={openCart}
                  className="rounded-xl bg-pasha-600 px-3 py-1.5 text-[11px] font-extrabold text-white transition hover:bg-pasha-500"
                >
                  عرض السلة
                </button>
              )}
              <button
                type="button"
                onClick={() => dismissToast(item.id)}
                aria-label="إغلاق التنبيه"
                className="flex h-7 w-7 items-center justify-center rounded-lg text-white/50 transition hover:bg-white/10 hover:text-white"
              >
                <i className="fa-solid fa-xmark text-xs" />
              </button>
            </div>
          </div>
          <div className="h-0.5 w-full bg-white/10">
            <div
              className="h-full bg-pasha-400"
              style={{ animation: 'progress 4.2s linear forwards' }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
