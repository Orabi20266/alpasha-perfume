import { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/ui/Logo';
import LoginGate from './admin/LoginGate';
import Overview from './admin/Overview';
import ProductsPanel from './admin/ProductsPanel';
import OffersPanel from './admin/OffersPanel';
import RafflePanel from './admin/RafflePanel';
import SocialPanel from './admin/SocialPanel';
import OrdersPanel from './admin/OrdersPanel';
import SettingsPanel from './admin/SettingsPanel';
import { useStore } from '../store/StoreContext';

const TABS = [
  { id: 'overview', label: 'نظرة عامة', icon: 'fa-chart-pie' },
  { id: 'products', label: 'المنتجات', icon: 'fa-boxes-stacked' },
  { id: 'offers', label: 'العروضات', icon: 'fa-tags' },
  { id: 'raffle', label: 'سحب الباشا', icon: 'fa-gem' },
  { id: 'social', label: 'السوشيال ميديا', icon: 'fa-share-nodes' },
  { id: 'orders', label: 'الطلبات', icon: 'fa-receipt' },
  { id: 'settings', label: 'الإعدادات', icon: 'fa-sliders' },
];

const TITLES = {
  overview: { title: 'نظرة عامة', desc: 'ملخص أداء المتجر وآخر الطلبات' },
  products: { title: 'المنتجات', desc: 'العطور والعود والبخور ومستلزمات العناية' },
  offers: { title: 'العروضات', desc: 'عروض الموسم وشرائح الخصم وبانر الرئيسية' },
  raffle: { title: 'سحب الباشا الذهبي', desc: 'أرقام السحب والمشاركات واختيار الفائز' },
  social: { title: 'السوشيال ميديا', desc: 'روابط الصفحات وبيانات التواصل' },
  orders: { title: 'الطلبات', desc: 'متابعة طلبات الشراء وطلبات عروض السعر' },
  settings: { title: 'الإعدادات', desc: 'العملة والضريبة والشحن وأمان اللوحة' },
};

export default function Admin() {
  const { isAdmin, logout, toast } = useStore();
  const [tab, setTab] = useState('overview');

  if (!isAdmin) return <LoginGate />;

  const current = TITLES[tab] || TITLES.overview;

  const handleLogout = () => {
    logout();
    toast('تم تسجيل الخروج من لوحة التحكم.', { type: 'info' });
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto flex max-w-[1500px]">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-l border-slate-200 bg-white lg:flex">
          <div className="border-b border-slate-100 p-5">
            <Logo />
            <span className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-pasha-50 px-2 py-1 text-[10px] font-bold text-pasha-700">
              <i className="fa-solid fa-user-shield" /> لوحة التحكم
            </span>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto p-3">
            {TABS.map((item) => {
              const active = tab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTab(item.id)}
                  className={`group flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-right text-xs font-bold transition-all ${
                    active
                      ? 'bg-gradient-to-l from-pasha-700 to-pasha-600 text-white shadow-md'
                      : 'text-slate-600 hover:bg-pasha-50 hover:text-pasha-700'
                  }`}
                >
                  <i
                    className={`fa-solid ${item.icon} w-4 text-center ${
                      active ? 'text-pasha-200' : 'text-slate-400 group-hover:text-pasha-500'
                    }`}
                  />
                  {item.label}
                  {active && <i className="fa-solid fa-chevron-left mr-auto text-[9px]" />}
                </button>
              );
            })}
          </nav>

          <div className="space-y-2 border-t border-slate-100 p-3">
            <Link
              to="/"
              className="flex items-center gap-2 rounded-xl bg-pasha-50 px-3.5 py-2.5 text-xs font-bold text-pasha-800 transition hover:bg-pasha-100"
            >
              <i className="fa-solid fa-store" /> عرض المتجر
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-500 transition hover:bg-rose-50 hover:text-rose-600"
            >
              <i className="fa-solid fa-right-from-bracket" /> تسجيل الخروج
            </button>
            <p className="px-1 pt-1 text-[9px] leading-relaxed text-slate-400">
              AL PASHA Admin · بيانات محفوظة محلياً
            </p>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur sm:px-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="lg:hidden">
                  <Logo compact />
                </div>
                <div className="min-w-0">
                  <h1 className="truncate text-base font-extrabold text-slate-900 sm:text-lg">
                    {current.title}
                  </h1>
                  <p className="hidden truncate text-[11px] text-slate-400 sm:block">
                    {current.desc}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <Link
                  to="/"
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] font-bold text-slate-600 transition hover:border-pasha-300 hover:text-pasha-700"
                >
                  <i className="fa-solid fa-store" />
                  <span className="hidden sm:inline">المتجر</span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-xl bg-rose-50 px-3 py-2 text-[11px] font-bold text-rose-600 transition hover:bg-rose-100"
                >
                  <i className="fa-solid fa-right-from-bracket" />
                  <span className="hidden sm:inline">خروج</span>
                </button>
              </div>
            </div>

            <nav className="no-scrollbar mt-3 flex gap-1.5 overflow-x-auto lg:hidden">
              {TABS.map((item) => {
                const active = tab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTab(item.id)}
                    className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-[11px] font-bold transition ${
                      active
                        ? 'bg-pasha-600 text-white shadow'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <i className={`fa-solid ${item.icon}`} />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </header>

          <main className="p-4 pb-24 sm:p-6">
            {tab === 'overview' && <Overview onTab={setTab} />}
            {tab === 'products' && <ProductsPanel />}
            {tab === 'offers' && <OffersPanel />}
            {tab === 'raffle' && <RafflePanel />}
            {tab === 'social' && <SocialPanel />}
            {tab === 'orders' && <OrdersPanel />}
            {tab === 'settings' && <SettingsPanel />}
          </main>
        </div>
      </div>
    </div>
  );
}
