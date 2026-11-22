import { useState } from 'react';
import { AdminCard, ConfirmDialog } from '../../components/admin/ui';
import { useStore } from '../../store/StoreContext';
import { digitsOnly, formatDate, money, waLink } from '../../lib/format';

export const ORDER_STATUS = {
  new: { label: 'جديد', tone: 'bg-pasha-50 text-pasha-700 border-pasha-200' },
  confirmed: { label: 'مؤكد', tone: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  shipped: { label: 'قيد التوصيل', tone: 'bg-amber-50 text-amber-700 border-amber-200' },
  delivered: { label: 'تم التسليم', tone: 'bg-teal-50 text-teal-700 border-teal-200' },
  cancelled: { label: 'ملغي', tone: 'bg-rose-50 text-rose-600 border-rose-200' },
};

function customerWhatsApp(phone, fallback) {
  const digits = digitsOnly(phone);
  if (digits.length < 8) return fallback;
  if (digits.startsWith('970')) return digits;
  if (digits.startsWith('0')) return `970${digits.slice(1)}`;
  return digits;
}

function OrderDetails({ order, onClose }) {
  const { settings, updateOrderStatus } = useStore();
  if (!order) return null;
  const status = ORDER_STATUS[order.status] || ORDER_STATUS.new;
  const customer = order.customer || {};

  return (
    <div
      className="fixed inset-0 z-[85] flex animate-fadeIn items-center justify-center bg-pasha-950/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="max-h-[90vh] w-full max-w-2xl animate-scaleIn overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <div className="sticky top-0 flex items-center justify-between bg-gradient-to-l from-pasha-900 to-pasha-700 px-6 py-4 text-white">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-receipt text-pasha-300" />
            <div>
              <h3 className="text-sm font-extrabold">
                {order.type === 'quote' ? 'طلب عرض سعر' : 'تفاصيل الطلب'}{' '}
                <span className="font-mono text-pasha-200">{order.id}</span>
              </h3>
              <p className="text-[10px] text-pasha-200">{formatDate(order.createdAt)}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <div className="space-y-4 p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className={`rounded-full border px-3 py-1 text-[11px] font-bold ${status.tone}`}>
              {status.label}
            </span>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700">
              <i className="fa-solid fa-hand-holding-dollar ml-1" />
              الدفع عند الاستلام
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs sm:grid-cols-2">
            <p>
              <span className="text-slate-400">الاسم: </span>
              <span className="font-bold text-slate-800">{customer.name}</span>
            </p>
            <p dir="ltr" className="text-right">
              <span className="text-slate-400">الجوال: </span>
              <span className="font-bold text-slate-800">{customer.phone}</span>
            </p>
            <p>
              <span className="text-slate-400">المدينة: </span>
              <span className="font-bold text-slate-800">{customer.city}</span>
            </p>
            <p>
              <span className="text-slate-400">الشركة: </span>
              <span className="font-bold text-slate-800">
                {customer.company || '—'}
              </span>
            </p>
            <p className="sm:col-span-2">
              <span className="text-slate-400">العنوان: </span>
              <span className="font-bold text-slate-800">
                {customer.address || '—'}
              </span>
            </p>
            {customer.notes && (
              <p className="sm:col-span-2">
                <span className="text-slate-400">ملاحظات: </span>
                <span className="font-bold text-slate-800">{customer.notes}</span>
              </p>
            )}
          </div>

          {order.type !== 'quote' && (
            <div
              className={`flex flex-wrap items-center justify-between gap-2 rounded-2xl border p-3 ${
                order.raffleEntered
                  ? 'border-emerald-200 bg-emerald-50'
                  : 'border-amber-200 bg-amber-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-amber-600 shadow-sm">
                  <i className="fa-solid fa-gem" />
                </span>
                <div>
                  <p className="text-[10px] font-bold text-slate-500">
                    رقم السحب — سحب الباشا الذهبي
                  </p>
                  <p className="font-mono text-sm font-black text-pasha-900" dir="ltr">
                    {order.raffleCode || '—'}
                  </p>
                </div>
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                  order.raffleEntered
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-amber-100 text-amber-700'
                }`}
              >
                {order.raffleEntered ? 'مسجل في السحب' : 'بانتظار تسجيل العميل'}
              </span>
            </div>
          )}

          {order.items.length ? (
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 text-[10px] text-slate-400">
                  <tr>
                    <th className="px-4 py-2 font-bold">المنتج</th>
                    <th className="px-4 py-2 font-bold">الكمية</th>
                    <th className="px-4 py-2 font-bold">الإجمالي</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {order.items.map((item) => (
                    <tr key={`${item.id}-${item.sku}`}>
                      <td className="px-4 py-2.5">
                        <p className="font-bold text-slate-700">{item.name}</p>
                        <p className="font-mono text-[10px] text-slate-400">
                          {item.sku}
                        </p>
                      </td>
                      <td className="px-4 py-2.5 text-slate-600">{item.qty}</td>
                      <td className="px-4 py-2.5 font-bold text-pasha-800">
                        {money(item.price * item.qty, settings.currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="rounded-xl bg-slate-50 p-4 text-center text-xs text-slate-500">
              طلب عرض سعر مخصص — التفاصيل في ملاحظات العميل.
            </p>
          )}

          {order.type !== 'quote' && (
            <div className="space-y-1.5 rounded-2xl border border-pasha-100 bg-pasha-50/60 p-4 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>المجموع الفرعي</span>
                <span>{money(order.subtotal, settings.currency)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between rounded-lg bg-emerald-50 px-2 py-1 text-emerald-700">
                  <span>خصم الموسم ({order.discountRate}%)</span>
                  <span className="font-bold">
                    - {money(order.discount, settings.currency)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-slate-500">
                <span>الضريبة</span>
                <span>{money(order.tax, settings.currency)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>التوصيل</span>
                <span>{order.shipping ? money(order.shipping, settings.currency) : 'مجاني'}</span>
              </div>
              <div className="flex justify-between border-t border-pasha-100 pt-2 text-sm font-black text-pasha-900">
                <span>الإجمالي</span>
                <span>{money(order.total, settings.currency)}</span>
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
            <select
              value={order.status}
              onChange={(event) => updateOrderStatus(order.id, event.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 focus:border-pasha-500 focus:outline-none"
            >
              {Object.entries(ORDER_STATUS).map(([value, item]) => (
                <option key={value} value={value}>
                  {item.label}
                </option>
              ))}
            </select>
            <a
              href={waLink(
                customerWhatsApp(customer.phone, settings.whatsapp),
                `مرحباً ${customer.name || ''}، بخصوص طلبكم ${order.id} من AL PASHA...`,
              )}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100"
            >
              <i className="fa-brands fa-whatsapp" /> مراسلة العميل
            </a>
            <button
              type="button"
              onClick={onClose}
              className="mr-auto rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-200"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrdersPanel() {
  const { orders, settings, updateOrderStatus, deleteOrder, toast } = useStore();
  const [selected, setSelected] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [filter, setFilter] = useState('all');

  const filtered =
    filter === 'all' ? orders : orders.filter((order) => order.status === filter);

  const handleDelete = () => {
    if (!toDelete) return;
    deleteOrder(toDelete.id);
    toast(`تم حذف الطلب ${toDelete.id}.`, { type: 'success' });
    setToDelete(null);
  };

  return (
    <div className="space-y-4">
      <AdminCard
        title="الطلبات وطلبات عروض السعر"
        description={`${orders.length} طلب محفوظ في هذا المتصفح`}
        icon="fa-receipt"
        actions={
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-600 focus:border-pasha-500 focus:outline-none"
          >
            <option value="all">كل الطلبات</option>
            {Object.entries(ORDER_STATUS).map(([value, item]) => (
              <option key={value} value={value}>
                {item.label}
              </option>
            ))}
          </select>
        }
      >
        {filtered.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[940px] text-right text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] uppercase text-slate-400">
                  <th className="pb-3 font-bold">الطلب</th>
                  <th className="pb-3 font-bold">العميل</th>
                  <th className="pb-3 font-bold">المدينة</th>
                  <th className="pb-3 font-bold">النوع</th>
                  <th className="pb-3 font-bold">رقم السحب</th>
                  <th className="pb-3 font-bold">الإجمالي</th>
                  <th className="pb-3 font-bold">الحالة</th>
                  <th className="pb-3 font-bold">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((order) => {
                  const status = ORDER_STATUS[order.status] || ORDER_STATUS.new;
                  return (
                    <tr key={order.id} className="transition hover:bg-slate-50/60">
                      <td className="py-3">
                        <button
                          type="button"
                          onClick={() => setSelected(order)}
                          className="font-mono font-bold text-pasha-700 hover:underline"
                        >
                          {order.id}
                        </button>
                        <p className="text-[10px] text-slate-400">
                          {formatDate(order.createdAt)}
                        </p>
                      </td>
                      <td className="py-3">
                        <p className="font-bold text-slate-700">
                          {order.customer?.name || '—'}
                        </p>
                        <p className="text-[10px] text-slate-400" dir="ltr">
                          {order.customer?.phone}
                        </p>
                      </td>
                      <td className="py-3 text-slate-600">
                        {order.customer?.city || '—'}
                      </td>
                      <td className="py-3">
                        <span
                          className={`rounded-lg px-2 py-1 text-[10px] font-bold ${
                            order.type === 'quote'
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-pasha-50 text-pasha-700'
                          }`}
                        >
                          {order.type === 'quote' ? 'عرض سعر' : 'طلب شراء'}
                        </span>
                      </td>
                      <td className="py-3">
                        {order.type === 'quote' ? (
                          <span className="text-slate-400">—</span>
                        ) : (
                          <>
                            <p className="font-mono text-[10px] font-bold text-pasha-800">
                              {order.raffleCode || '—'}
                            </p>
                            <p
                              className={`text-[9px] font-bold ${
                                order.raffleEntered ? 'text-emerald-600' : 'text-amber-600'
                              }`}
                            >
                              {order.raffleEntered ? 'مسجل' : 'بانتظار التسجيل'}
                            </p>
                          </>
                        )}
                      </td>
                      <td className="py-3 font-black text-pasha-800">
                        {order.type === 'quote'
                          ? 'مخصص'
                          : money(order.total, settings.currency)}
                      </td>
                      <td className="py-3">
                        <select
                          value={order.status}
                          onChange={(event) =>
                            updateOrderStatus(order.id, event.target.value)
                          }
                          className={`rounded-lg border px-2 py-1 text-[10px] font-bold focus:outline-none ${status.tone}`}
                        >
                          {Object.entries(ORDER_STATUS).map(([value, item]) => (
                            <option key={value} value={value}>
                              {item.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setSelected(order)}
                            aria-label="عرض التفاصيل"
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-pasha-50 text-pasha-600 transition hover:bg-pasha-100"
                          >
                            <i className="fa-solid fa-eye text-[11px]" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setToDelete(order)}
                            aria-label="حذف الطلب"
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-500 transition hover:bg-rose-100"
                          >
                            <i className="fa-solid fa-trash text-[11px]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-14 text-center">
            <i className="fa-solid fa-receipt mb-3 block text-3xl text-slate-300" />
            <h4 className="text-sm font-extrabold text-slate-700">لا توجد طلبات بعد</h4>
            <p className="mt-1 text-[11px] text-slate-400">
              ستظهر هنا الطلبات الواردة من صفحة إتمام الطلب.
            </p>
          </div>
        )}
      </AdminCard>

      <OrderDetails order={selected} onClose={() => setSelected(null)} />

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="حذف الطلب"
        message={`سيتم حذف الطلب ${toDelete?.id || ''} نهائياً من السجل.`}
        confirmLabel="نعم، احذف"
        onCancel={() => setToDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
