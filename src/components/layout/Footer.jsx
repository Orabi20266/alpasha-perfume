import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from '../ui/Logo';
import { useStore } from '../../store/StoreContext';
import { useUi } from '../../store/UiContext';
import { waLink } from '../../lib/format';

const SOCIALS = [
  { key: 'facebook', icon: 'fa-facebook-f', label: 'فيسبوك' },
  { key: 'instagram', icon: 'fa-instagram', label: 'إنستغرام' },
  { key: 'x', icon: 'fa-x-twitter', label: 'إكس' },
  { key: 'linkedin', icon: 'fa-linkedin-in', label: 'لينكدإن' },
  { key: 'tiktok', icon: 'fa-tiktok', label: 'تيك توك' },
];

export default function Footer() {
  const { settings, toast } = useStore();
  const { setFilter, resetFilters } = useUi();
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const openCategory = (category) => {
    resetFilters();
    setFilter('category', category);
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(
        () => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' }),
        90,
      );
    } else {
      document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const activeSocials = SOCIALS.filter((item) => settings.social?.[item.key]);

  const subscribe = (event) => {
    event.preventDefault();
    if (!email.trim()) return;
    setEmail('');
    toast('تم تسجيل بريدك في نشرة عروض الباشا.', { type: 'success' });
  };

  return (
    <footer id="contact" className="border-t border-slate-200 bg-white pb-8 pt-12 text-slate-600">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 border-b border-slate-100 pb-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Logo />
            <p className="text-xs leading-relaxed text-slate-500">
              الباشا للعطور — وجهتك للعطور الشرقية والفرنسية الفاخرة، العود ودهن
              العود، البخور والمباخر، وزيوت المسك، بأصالة مضمونة وثبات عالٍ.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <a
                href={waLink(settings.whatsapp)}
                target="_blank"
                rel="noreferrer"
                aria-label="تواصل مع AL PASHA على واتساب"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition hover:bg-emerald-500 hover:text-white"
              >
                <i className="fa-brands fa-whatsapp text-lg" />
              </a>
              {activeSocials.map((item) => (
                <a
                  key={item.key}
                  href={settings.social[item.key]}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`صفحة الباشا على ${item.label}`}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-pasha-50 text-pasha-700 transition hover:-translate-y-0.5 hover:bg-pasha-600 hover:text-white"
                >
                  <i className={`fa-brands ${item.icon}`} />
                </a>
              ))}
            </div>

            <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-[11px] font-bold text-emerald-700">
              <i className="fa-solid fa-hand-holding-dollar" />
              {settings.payments}
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-extrabold text-slate-900">الأقسام الرئيسية</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              {[
                ['men', 'عطور رجالية فاخرة'],
                ['women', 'عطور نسائية وورد طائفي'],
                ['oud', 'عود ودهن عود أصلي'],
                ['incense', 'بخور ومباخر شرقية'],
                ['sets', 'أطقم هدايا وتغليف فاخر'],
                ['body', 'زيوت ومسك وعناية بالجسم'],
              ].map(([id, label]) => (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => openCategory(id)}
                    className="flex items-center gap-2 text-right transition hover:text-pasha-600"
                  >
                    <i className="fa-solid fa-angle-left text-pasha-500" />
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-extrabold text-slate-900">خدمات العملاء</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <Link to="/offers" className="flex items-center gap-2 transition hover:text-pasha-600">
                  <i className="fa-solid fa-angle-left text-pasha-500" />
                  عروض الموسم وشرائح الخصم
                </Link>
              </li>
              <li>
                <Link to="/raffle" className="flex items-center gap-2 transition hover:text-pasha-600">
                  <i className="fa-solid fa-angle-left text-pasha-500" />
                  سحب الباشا الذهبي وأرقام السحب
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() =>
                    toast('جميع عطور الباشا أصلية ومضمونة، مع ضمان الأصالة لكل منتج.', {
                      type: 'info',
                    })
                  }
                  className="flex items-center gap-2 transition hover:text-pasha-600"
                >
                  <i className="fa-solid fa-angle-left text-pasha-500" />
                  سياسة الضمان وضمان الأصالة
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() =>
                    toast('التوصيل متاح لجميع المدن خلال 24-48 ساعة، والدفع عند الاستلام.', {
                      type: 'info',
                    })
                  }
                  className="flex items-center gap-2 transition hover:text-pasha-600"
                >
                  <i className="fa-solid fa-angle-left text-pasha-500" />
                  الشحن والتوصيل لجميع المدن
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() =>
                    toast('يمكنك استرجاع أو استبدال المنتجات خلال 14 يوماً من الاستلام.', {
                      type: 'info',
                    })
                  }
                  className="flex items-center gap-2 transition hover:text-pasha-600"
                >
                  <i className="fa-solid fa-angle-left text-pasha-500" />
                  سياسة الاستبدال والاسترجاع
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-extrabold text-slate-900">تواصل مباشر ونشرة العروض</h4>
            <div className="mb-4 space-y-2 rounded-2xl border border-pasha-100 bg-pasha-50/80 p-3.5 text-xs">
              <a
                href={waLink(settings.whatsapp)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 font-extrabold text-emerald-700 transition hover:text-emerald-800"
              >
                <i className="fa-brands fa-whatsapp text-lg" />
                <span dir="ltr">{settings.whatsappDisplay}</span>
              </a>
              <a
                href={`mailto:${settings.email}`}
                className="flex items-center gap-2 text-slate-600 transition hover:text-pasha-700"
              >
                <i className="fa-solid fa-envelope text-pasha-600" />
                <span className="truncate">{settings.email}</span>
              </a>
              <p className="flex items-start gap-2 leading-relaxed text-slate-500">
                <i className="fa-solid fa-location-dot mt-0.5 text-pasha-600" />
                {settings.address}
              </p>
              <p className="flex items-start gap-2 leading-relaxed text-slate-500">
                <i className="fa-solid fa-clock mt-0.5 text-pasha-600" />
                {settings.hours}
              </p>
            </div>

            <form onSubmit={subscribe} className="mb-3 flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="البريد الإلكتروني..."
                aria-label="البريد الإلكتروني للنشرة"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs focus:border-pasha-500 focus:bg-white focus:outline-none"
              />
              <button
                type="submit"
                className="shrink-0 rounded-xl bg-pasha-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-pasha-700"
              >
                اشتراك
              </button>
            </form>
            {settings.social?.facebook && (
              <a
                href={settings.social.facebook}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-[11px] font-bold text-slate-600 transition hover:border-pasha-300 hover:bg-pasha-50 hover:text-pasha-700"
              >
                <i className="fa-brands fa-facebook text-base text-[#1877f2]" />
                تابع صفحة الباشا الرسمية على فيسبوك
              </a>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 pt-6 text-xs text-slate-400 sm:flex-row">
          <p>
            © {new Date().getFullYear()} متجر{' '}
            <strong className="text-pasha-700">الباشا للعطور</strong>. جميع
            الحقوق محفوظة.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <span className="flex items-center gap-1">
              <i className="fa-solid fa-lock text-pasha-500" /> دفع عند الاستلام
            </span>
            <span>•</span>
            <span>أصالة مضمونة 100%</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
