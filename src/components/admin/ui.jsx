export function Field({ label, hint, error, required, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold text-slate-700">
        {label} {required && <span className="text-rose-500">*</span>}
      </span>
      {children}
      {error ? (
        <span className="mt-1 block text-[11px] font-semibold text-rose-500">{error}</span>
      ) : hint ? (
        <span className="mt-1 block text-[11px] text-slate-400">{hint}</span>
      ) : null}
    </label>
  );
}

const base =
  'w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 transition placeholder:text-slate-400 focus:border-pasha-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pasha-500/10';

export function Input({ label, hint, error, required, className = '', ...props }) {
  return (
    <Field label={label} hint={hint} error={error} required={required}>
      <input
        className={`${base} ${error ? 'border-rose-300' : ''} ${className}`}
        {...props}
      />
    </Field>
  );
}

export function Textarea({ label, hint, error, required, className = '', ...props }) {
  return (
    <Field label={label} hint={hint} error={error} required={required}>
      <textarea
        className={`${base} resize-none leading-relaxed ${error ? 'border-rose-300' : ''} ${className}`}
        {...props}
      />
    </Field>
  );
}

export function Select({ label, hint, error, required, className = '', children, ...props }) {
  return (
    <Field label={label} hint={hint} error={error} required={required}>
      <select className={`${base} cursor-pointer ${className}`} {...props}>
        {children}
      </select>
    </Field>
  );
}

export function Toggle({ checked, onChange, label, description }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-right transition hover:border-pasha-300"
      aria-pressed={checked}
    >
      <span>
        <span className="block text-xs font-bold text-slate-700">{label}</span>
        {description && (
          <span className="mt-0.5 block text-[11px] text-slate-400">{description}</span>
        )}
      </span>
      <span
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? 'bg-pasha-600' : 'bg-slate-300'
        }`}
      >
        <span
          className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all"
          style={{ right: checked ? 2 : 22 }}
        />
      </span>
    </button>
  );
}

export function AdminCard({ title, description, icon, actions, children, className = '' }) {
  return (
    <section
      className={`rounded-2xl border border-slate-200 bg-white shadow-card ${className}`}
    >
      {(title || actions) && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-2.5">
            {icon && (
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-pasha-50 text-pasha-600">
                <i className={`fa-solid ${icon}`} />
              </span>
            )}
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">{title}</h3>
              {description && (
                <p className="text-[11px] text-slate-400">{description}</p>
              )}
            </div>
          </div>
          {actions}
        </div>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'تأكيد',
  cancelLabel = 'إلغاء',
  tone = 'danger',
  onConfirm,
  onCancel,
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[95] flex animate-fadeIn items-center justify-center bg-pasha-950/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
    >
      <div className="w-full max-w-sm animate-scaleIn rounded-2xl bg-white p-6 shadow-2xl">
        <div
          className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full ${
            tone === 'danger'
              ? 'bg-rose-50 text-rose-500'
              : 'bg-pasha-50 text-pasha-600'
          }`}
        >
          <i className={`fa-solid ${tone === 'danger' ? 'fa-triangle-exclamation' : 'fa-circle-info'} text-xl`} />
        </div>
        <h3 className="text-center text-base font-extrabold text-slate-900">{title}</h3>
        <p className="mt-2 text-center text-xs leading-relaxed text-slate-500">{message}</p>
        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-200"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`flex-1 rounded-xl px-4 py-2.5 text-xs font-extrabold text-white transition ${
              tone === 'danger'
                ? 'bg-rose-600 hover:bg-rose-700'
                : 'bg-pasha-600 hover:bg-pasha-700'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
