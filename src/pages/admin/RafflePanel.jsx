import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AdminCard,
  ConfirmDialog,
  Input,
  Textarea,
  Toggle,
} from '../../components/admin/ui';
import { useStore } from '../../store/StoreContext';
import { formatDate, money } from '../../lib/format';

export default function RafflePanel() {
  const {
    settings,
    orders,
    updateRaffle,
    drawRaffle,
    resetRaffleWinner,
    toast,
  } = useStore();
  const raffle = settings.raffle;
  const [form, setForm] = useState(() => ({ ...raffle }));
  const [confirmDraw, setConfirmDraw] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const set = (key) => (event) =>
    setForm((current) => ({ ...current, [key]: event.target.value }));

  const save = (event) => {
    event.preventDefault();
    if (!form.title.trim() || !form.prize.trim()) {
      toast('عنوان السحب والجائزة مطلوبان.', { type: 'error' });
      return;
    }
    updateRaffle({
      enabled: form.enabled,
      title: form.title.trim(),
      prize: form.prize.trim(),
      description: form.description,
      drawDate: form.drawDate,
      terms: form.terms,
    });
    toast('تم حفظ إعدادات سحب الباشا الذهبي.', { type: 'success' });
  };

  const purchaseOrders = orders.filter((order) => order.type === 'order');
  const entered = purchaseOrders.filter((order) => order.raffleEntered);
  const eligible = entered.filter((order) => order.status !== 'cancelled');
  const winner = raffle.winner;

  const copy = async (value) => {
    try {
      await navigator.clipboard.writeText(value);
      toast(`تم نسخ رقم السحب ${value}.`, { type: 'success' });
    } catch {
      toast(`رقم السحب: ${value}`, { type: 'info' });
    }
  };

  const handleDraw = () => {
    const picked = drawRaffle();
    setConfirmDraw(false);
    if (!picked) {
      toast('لا توجد أرقام مسجلة بعد — شارك العملاء برقم السحب أولاً.', {
        type: 'error',
      });
      return;
    }
    toast(`تم اختيار الفائز ${picked.name} — ${picked.code}`, { type: 'success' });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: 'طلبات الشراء', value: purchaseOrders.length, icon: 'fa-receipt', tone: 'from-pasha-500 to-pasha-700' },
          { label: 'أرقام مسجلة', value: entered.length, icon: 'fa-ticket', tone: 'from-emerald-400 to-emerald-600' },
          { label: 'مؤهلة للسحب', value: eligible.length, icon: 'fa-gem', tone: 'from-amber-400 to-amber-600' },
          {
            label: 'حالة السحب',
            value: raffle.enabled ? 'نشطة' : 'متوقفة',
            icon: 'fa-toggle-on',
            tone: raffle.enabled ? 'from-sky-400 to-sky-600' : 'from-slate-400 to-slate-600',
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card"
          >
            <span
              className={`mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br text-white ${stat.tone}`}
            >
              <i className={`fa-solid ${stat.icon}`} />
            </span>
            <span className="block text-[10px] font-bold text-slate-400">
              {stat.label}
            </span>
            <span className="mt-0.5 block text-lg font-black text-slate-900">
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <form onSubmit={save} className="space-y-4 xl:col-span-7">
          <AdminCard
            title="إعدادات سحب الباشا الذهبي"
            description="تظهر هذه البيانات في الصفحة الرئيسية وصفحة السحب"
            icon="fa-gem"
            actions={
              <Link
                to="/raffle"
                target="_blank"
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] font-bold text-slate-600 transition hover:border-pasha-300 hover:text-pasha-700"
              >
                <i className="fa-solid fa-up-right-from-square" />
                معاينة
              </Link>
            }
          >
            <div className="space-y-4">
              <Toggle
                checked={Boolean(form.enabled)}
                onChange={(value) => setForm((current) => ({ ...current, enabled: value }))}
                label="تفعيل السحب"
                description="عند الإيقاف يختفي قسم السحب من المتجر وتتوقف المشاركات"
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  label="عنوان السحب"
                  required
                  value={form.title}
                  onChange={set('title')}
                  placeholder="سحب الباشا الذهبي"
                />
                <Input
                  label="الجائزة"
                  required
                  value={form.prize}
                  onChange={set('prize')}
                  placeholder="طقم عطور فاخر + عود ملكي"
                />
                <Input
                  label="موعد السحب"
                  type="date"
                  value={form.drawDate}
                  onChange={set('drawDate')}
                />
              </div>

              <Textarea
                label="وصف السحب"
                rows="3"
                value={form.description}
                onChange={set('description')}
              />
              <Textarea
                label="شروط المشاركة"
                rows="4"
                value={form.terms}
                onChange={set('terms')}
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="btn-shine flex items-center gap-2 rounded-2xl bg-pasha-600 px-6 py-2.5 text-xs font-extrabold text-white shadow-md transition hover:bg-pasha-700"
                >
                  <i className="fa-solid fa-floppy-disk" />
                  حفظ إعدادات السحب
                </button>
              </div>
            </div>
          </AdminCard>

          <AdminCard
            title="نتيجة السحب"
            description={
              winner
                ? `تم السحب بين ${winner.entries} مشاركة`
                : 'لم يتم إجراء السحب بعد'
            }
            icon="fa-trophy"
          >
            {winner ? (
              <div className="relative overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-amber-50 p-5">
                <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-amber-300/40 blur-2xl" />
                <div className="relative flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 to-amber-500 text-2xl text-amber-900 shadow">
                      <i className="fa-solid fa-gem" />
                    </span>
                    <div>
                      <span className="text-[10px] font-black text-amber-700">
                        الفائز بالسحب
                      </span>
                      <h4 className="text-lg font-black text-slate-900">{winner.name}</h4>
                      <p className="text-[11px] text-slate-500">
                        {winner.city} · {winner.phone}
                      </p>
                      <p className="mt-1 font-mono text-xs font-bold text-pasha-800">
                        {winner.code} · طلب {winner.orderId}
                      </p>
                      <p className="mt-1 text-[10px] text-slate-400">
                        {formatDate(winner.drawnAt)} · قيمة الطلب{' '}
                        {money(winner.total, settings.currency)}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <a
                      href={`https://wa.me/${String(winner.phone || '').replace(/\D/g, '').replace(/^0/, '970')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-[11px] font-bold text-emerald-700 transition hover:bg-emerald-100"
                    >
                      <i className="fa-brands fa-whatsapp" /> تهنئة الفائز
                    </a>
                    <button
                      type="button"
                      onClick={() => setConfirmReset(true)}
                      className="rounded-xl bg-slate-100 px-3 py-2 text-[11px] font-bold text-slate-600 transition hover:bg-slate-200"
                    >
                      <i className="fa-solid fa-rotate-left ml-1" />
                      إعادة السحب
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-amber-300 bg-amber-50/60 p-6 text-center">
                <i className="fa-solid fa-gem mb-2 block text-2xl text-amber-400" />
                <p className="text-xs font-bold text-slate-600">
                  {eligible.length
                    ? `${eligible.length} رقم مؤهل — اضغط لاختيار الفائز عشوائياً`
                    : 'لا توجد أرقام مسجلة بعد. سيظهر هنا الفائز بعد السحب.'}
                </p>
                <button
                  type="button"
                  disabled={!eligible.length}
                  onClick={() => setConfirmDraw(true)}
                  className="btn-shine mt-3 inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-extrabold text-white shadow transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  <i className="fa-solid fa-shuffle" />
                  إجراء السحب الآن
                </button>
              </div>
            )}
          </AdminCard>
        </form>

        <AdminCard
          className="xl:col-span-5"
          title="أرقام السحب"
          description={`${purchaseOrders.length} طلب شراء — ${entered.length} مسجل في السحب`}
          icon="fa-ticket"
        >
          {purchaseOrders.length ? (
            <div className="max-h-[620px] space-y-2 overflow-y-auto pr-1">
              {purchaseOrders.map((order) => (
                <div
                  key={order.id}
                  className={`rounded-xl border p-3 transition ${
                    order.raffleEntered
                      ? 'border-emerald-200 bg-emerald-50/60'
                      : 'border-slate-200 bg-slate-50/60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => order.raffleCode && copy(order.raffleCode)}
                      className="font-mono text-xs font-black text-pasha-800 transition hover:text-pasha-600"
                      title="نسخ رقم السحب"
                    >
                      {order.raffleCode || '—'}
                    </button>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        order.raffleEntered
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {order.raffleEntered ? 'مسجل' : 'بانتظار التسجيل'}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] font-bold text-slate-700">
                    {order.customer?.name}{' '}
                    <span className="font-normal text-slate-400">
                      · {order.customer?.city}
                    </span>
                  </p>
                  <div className="mt-1 flex flex-wrap items-center justify-between gap-1 text-[10px] text-slate-400">
                    <span>
                      {order.id} · {money(order.total, settings.currency)}
                    </span>
                    <span>{formatDate(order.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <i className="fa-solid fa-ticket mb-2 block text-2xl text-slate-300" />
              <p className="text-xs text-slate-400">
                ستظهر أرقام السحب هنا بعد أول طلب شراء.
              </p>
            </div>
          )}
        </AdminCard>
      </div>

      <ConfirmDialog
        open={confirmDraw}
        title="إجراء السحب"
        message={`سيتم اختيار فائز واحد عشوائياً من ${eligible.length} رقم مسجل. هل أنت مستعد؟`}
        confirmLabel="نعم، اسحب الآن"
        tone="success"
        onCancel={() => setConfirmDraw(false)}
        onConfirm={handleDraw}
      />

      <ConfirmDialog
        open={confirmReset}
        title="إعادة السحب"
        message="سيتم إلغاء اسم الفائز الحالي والسماح بإجراء سحب جديد. أرقام المشاركين لن تُحذف."
        confirmLabel="نعم، أعد السحب"
        onCancel={() => setConfirmReset(false)}
        onConfirm={() => {
          resetRaffleWinner();
          setConfirmReset(false);
          toast('تم مسح الفائز الحالي — يمكنك إجراء سحب جديد.', { type: 'info' });
        }}
      />
    </div>
  );
}
