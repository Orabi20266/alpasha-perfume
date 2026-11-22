import { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../components/ui/Logo';
import { useStore } from '../../store/StoreContext';

export default function LoginGate() {
  const { login, toast } = useStore();
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  const submit = (event) => {
    event.preventDefault();
    if (login(password)) {
      toast('مرحباً بك في لوحة تحكم الباشا.', { type: 'success' });
      setError('');
    } else {
      setError('كلمة المرور غير صحيحة، حاول مرة أخرى.');
      setAttempt((value) => value + 1);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-blueprint px-4 py-10">
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-pasha-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-pasha-400/10 blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <Logo dark />
        </div>

        <div
          key={attempt}
          className={`rounded-3xl border border-white/15 bg-white/95 p-6 shadow-2xl backdrop-blur sm:p-8 ${
            error ? 'animate-shake' : 'animate-scaleIn'
          }`}
        >
          <div className="mb-5 text-center">
            <span className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-pasha-50 text-2xl text-pasha-600">
              <i className="fa-solid fa-user-shield" />
            </span>
            <h1 className="text-xl font-black text-slate-900">لوحة تحكم المتجر</h1>
            <p className="mt-1 text-xs text-slate-500">
              إدارة المنتجات، العروضات، السوشيال ميديا والطلبات.
            </p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <label className="block">
              <span className="mb-1 block text-xs font-bold text-slate-700">
                كلمة مرور الأدمن
              </span>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setError('');
                  }}
                  placeholder="أدخل كلمة المرور"
                  autoFocus
                  className={`w-full rounded-xl border bg-slate-50 px-3.5 py-3 pl-11 text-sm transition focus:bg-white focus:outline-none ${
                    error
                      ? 'border-rose-300 focus:border-rose-400'
                      : 'border-slate-200 focus:border-pasha-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShow((value) => !value)}
                  aria-label={show ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 transition hover:text-pasha-600"
                >
                  <i className={`fa-solid ${show ? 'fa-eye-slash' : 'fa-eye'}`} />
                </button>
              </div>
              {error && (
                <span className="mt-1 block text-[11px] font-semibold text-rose-500">
                  {error}
                </span>
              )}
            </label>

            <button
              type="submit"
              className="btn-shine w-full rounded-xl bg-gradient-to-l from-pasha-700 to-pasha-600 px-5 py-3 text-sm font-extrabold text-white shadow-md transition hover:from-pasha-800 hover:to-pasha-700 active:scale-[0.99]"
            >
              <i className="fa-solid fa-lock-open ml-2" />
              دخول لوحة التحكم
            </button>
          </form>

          <Link
            to="/"
            className="mt-4 flex items-center justify-center gap-2 text-xs font-bold text-slate-500 transition hover:text-pasha-700"
          >
            <i className="fa-solid fa-arrow-right" />
            العودة إلى المتجر
          </Link>
        </div>
      </div>
    </div>
  );
}
