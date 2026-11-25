import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-4 flex h-20 w-20 animate-float items-center justify-center rounded-full bg-gold-50 text-3xl text-gold-600">
        <i className="fa-solid fa-compass-drafting" />
      </div>
      <h1 className="font-messiri text-2xl font-bold text-ink">الصفحة غير موجودة</h1>
      <p className="mt-2 max-w-sm text-sm text-slate-500">
        الرابط الذي تحاول الوصول إليه غير متوفر في متجر الباشا.
      </p>
      <Link
        to="/"
        className="mt-5 rounded-2xl bg-pasha-600 px-6 py-3 text-sm font-bold text-white shadow transition hover:bg-pasha-700"
      >
        العودة إلى المتجر
      </Link>
    </div>
  );
}
