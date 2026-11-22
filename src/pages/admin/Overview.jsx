import { AdminCard } from '../../components/admin/ui';
import ProductArt from '../../components/ui/ProductArt';
import { useStore } from '../../store/StoreContext';
import { formatDate, money } from '../../lib/format';
import { ORDER_STATUS } from './OrdersPanel';

export default function Overview({ onTab }) {
  const { products, orders, settings, offers } = useStore();

  const purchaseOrders = orders.filter((order) => order.type === 'order');
  const quotes = orders.filter((order) => order.type === 'quote');
  const revenue = purchaseOrders
    .filter((order) => order.status !== 'cancelled')
    .reduce((sum, order) => sum + Number(order.total || 0), 0);
  const lowStock = products.filter((product) => Number(product.stock) <= 5);

  const stats = [
    {
      label: 'المنتجات',
      value: products.length,
      icon: 'fa-boxes-stacked',
      tone: 'from-pasha-500 to-pasha-700',
      tab: 'products',
    },
    {
      label: 'طلبات الشراء',
      value: purchaseOrders.length,
      icon: 'fa-receipt',
      tone: 'from-emerald-400 to-emerald-600',
      tab: 'orders',
    },
    {
      label: 'طلبات عروض السعر',
      value: quotes.length,
      icon: 'fa-file-invoice-dollar',
      tone: 'from-amber-400 to-amber-600',
      tab: 'orders',
    },
    {
      label: 'إجمالي المبيعات',
      value: money(revenue, settings.currency),
      icon: 'fa-sack-dollar',
      tone: 'from-sky-400 to-sky-600',
      tab: 'orders',
      wide: true,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-l from-pasha-950 via-pasha-800 to-pasha-600 p-6 text-white shadow-lg">
        <div className="pointer-events-none absolute -left-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold text-pasha-200">لوحة تحكم الباشا</span>
            <h2 className="mt-1 text-xl font-black sm:text-2xl">
              مرحباً بك، إليك ملخص المتجر اليوم
            </h2>
            <p className="mt-1 text-xs text-pasha-100/80">
              {products.length} منتج · {orders.length} طلب · {offers.productIds.length} منتج
              في العروضات
            </p>
          </div>
          <button
            type="button"
            onClick={() => onTab('products')}
            className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-extrabold text-pasha-900 shadow transition hover:bg-pasha-50"
          >
            <i className="fa-solid fa-plus" />
            إدارة المنتجات
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <button
            key={stat.label}
            type="button"
            onClick={() => onTab(stat.tab)}
            className={`group animate-fadeUp rounded-2xl border border-slate-200 bg-white p-4 text-right shadow-card transition hover:-translate-y-0.5 hover:border-pasha-200 ${
              stat.wide ? 'col-span-2 lg:col-span-1' : ''
            }`}
            style={{ animationDelay: `${index * 60}ms` }}
          >
            <span
              className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-white ${stat.tone}`}
            >
              <i className={`fa-solid ${stat.icon}`} />
            </span>
            <span className="block text-[11px] font-bold text-slate-400">
              {stat.label}
            </span>
            <span className="mt-0.5 block text-xl font-black text-slate-900">
              {stat.value}
            </span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <AdminCard
          title="أحدث الطلبات"
          description="آخر الطلبات الواردة من المتجر"
          icon="fa-clock-rotate-left"
          className="xl:col-span-2"
          actions={
            <button
              type="button"
              onClick={() => onTab('orders')}
              className="text-[11px] font-bold text-pasha-700 hover:underline"
            >
              عرض الكل
            </button>
          }
        >
          {orders.length ? (
            <ul className="space-y-2">
              {orders.slice(0, 5).map((order) => {
                const status = ORDER_STATUS[order.status] || ORDER_STATUS.new;
                return (
                  <li
                    key={order.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50/60 p-3"
                  >
                    <div>
                      <p className="font-mono text-[11px] font-bold text-pasha-700">
                        {order.id}
                      </p>
                      <p className="text-xs font-bold text-slate-700">
                        {order.customer?.name}{' '}
                        <span className="font-normal text-slate-400">
                          · {order.customer?.city}
                        </span>
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-pasha-800">
                        {order.type === 'quote'
                          ? 'عرض سعر'
                          : money(order.total, settings.currency)}
                      </span>
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${status.tone}`}
                      >
                        {status.label}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="py-10 text-center">
              <i className="fa-solid fa-inbox mb-2 block text-2xl text-slate-300" />
              <p className="text-xs text-slate-400">
                لا توجد طلبات بعد — ستظهر هنا فور ورودها.
              </p>
            </div>
          )}
        </AdminCard>

        <AdminCard
          title="مخزون منخفض"
          description="منتجات تحتاج إعادة توريد"
          icon="fa-triangle-exclamation"
          actions={
            <button
              type="button"
              onClick={() => onTab('products')}
              className="text-[11px] font-bold text-pasha-700 hover:underline"
            >
              إدارة
            </button>
          }
        >
          {lowStock.length ? (
            <ul className="space-y-2">
              {lowStock.slice(0, 5).map((product) => (
                <li
                  key={product.id}
                  className="flex items-center gap-2.5 rounded-xl border border-amber-100 bg-amber-50/60 p-2.5"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white p-1">
                    <ProductArt product={product} className="h-full w-full" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[11px] font-bold text-slate-700">
                      {product.name}
                    </p>
                    <p className="text-[10px] font-bold text-amber-600">
                      متبقي {product.stock} قطعة
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-10 text-center">
              <i className="fa-solid fa-circle-check mb-2 block text-2xl text-emerald-400" />
              <p className="text-xs text-slate-400">كل المنتجات بمخزون جيد.</p>
            </div>
          )}
        </AdminCard>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { tab: 'offers', icon: 'fa-tags', title: 'العروضات', text: 'عدّل شرائح الخصم والبانر والمنتجات المشمولة' },
          { tab: 'raffle', icon: 'fa-gem', title: 'سحب الباشا', text: 'أرقام السحب المسجلة واختيار الفائز' },
          { tab: 'social', icon: 'fa-share-nodes', title: 'السوشيال ميديا', text: 'روابط فيسبوك وواتساب وبيانات التواصل' },
          { tab: 'settings', icon: 'fa-sliders', title: 'الإعدادات', text: 'العملة والضريبة والشحن وكلمة المرور' },
        ].map((item) => (
          <button
            key={item.tab}
            type="button"
            onClick={() => onTab(item.tab)}
            className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-right shadow-card transition hover:-translate-y-0.5 hover:border-pasha-200"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-pasha-50 text-pasha-600">
              <i className={`fa-solid ${item.icon}`} />
            </span>
            <span>
              <span className="block text-xs font-extrabold text-slate-800">
                {item.title}
              </span>
              <span className="mt-0.5 block text-[10px] leading-relaxed text-slate-400">
                {item.text}
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
