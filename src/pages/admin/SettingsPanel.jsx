import { useState } from 'react';
import { AdminCard, ConfirmDialog, Input } from '../../components/admin/ui';
import { useStore } from '../../store/StoreContext';

export default function SettingsPanel() {
  const { settings, products, offers, orders, updateSettings, resetDemoData, toast } =
    useStore();
  const [form, setForm] = useState(() => ({
    ...settings,
    newPassword: '',
  }));
  const [confirmReset, setConfirmReset] = useState(false);

  const set = (key) => (event) =>
    setForm((current) => ({ ...current, [key]: event.target.value }));

  const save = (event) => {
    event.preventDefault();
    if (form.newPassword && form.newPassword.trim().length < 4) {
      toast('كلمة المرور الجديدة يجب أن تكون 4 أحرف على الأقل.', { type: 'error' });
      return;
    }
    const patch = {
      storeName: form.storeName,
      storeNameAr: form.storeNameAr,
      tagline: form.tagline,
      currency: form.currency,
      currencyName: form.currencyName,
      taxRate: Number(form.taxRate) || 0,
      shippingFee: Number(form.shippingFee) || 0,
      freeShippingThreshold: Number(form.freeShippingThreshold) || 0,
    };
    if (form.newPassword) patch.adminPassword = form.newPassword.trim();
    updateSettings(patch);
    setForm((current) => ({ ...current, newPassword: '' }));
    toast('تم حفظ إعدادات المتجر.', { type: 'success' });
  };

  const exportData = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      products,
      settings,
      offers,
      orders,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pasha-store-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    toast('تم تنزيل نسخة احتياطية من بيانات المتجر.', { type: 'success' });
  };

  const reset = () => {
    resetDemoData();
    setConfirmReset(false);
    toast('تمت استعادة البيانات الافتراضية للمتجر.', { type: 'info' });
  };

  return (
    <form onSubmit={save} className="space-y-4">
      <AdminCard
        title="إعدادات المتجر العامة"
        description="الاسم والوصف والعملة المستخدمة في كل الصفحات"
        icon="fa-sliders"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="اسم المتجر (لاتيني)"
            value={form.storeName}
            onChange={set('storeName')}
            placeholder="AL PASHA"
          />
          <Input
            label="اسم المتجر (عربي)"
            value={form.storeNameAr}
            onChange={set('storeNameAr')}
            placeholder="الباشا للعطور"
          />
          <div className="sm:col-span-2">
            <Input
              label="الوصف المختصر"
              value={form.tagline}
              onChange={set('tagline')}
            />
          </div>
          <Input
            label="رمز العملة"
            value={form.currency}
            onChange={set('currency')}
            placeholder="₪"
            hint="يظهر بجانب كل سعر"
          />
          <Input
            label="اسم العملة"
            value={form.currencyName}
            onChange={set('currencyName')}
            placeholder="شيكل"
          />
        </div>
      </AdminCard>

      <AdminCard
        title="الضريبة والشحن"
        description="تُحسب تلقائياً في السلة وصفحة إتمام الطلب"
        icon="fa-truck-fast"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Input
            label="نسبة الضريبة (%)"
            type="number"
            min="0"
            max="100"
            step="0.5"
            value={form.taxRate}
            onChange={set('taxRate')}
          />
          <Input
            label={`رسوم التوصيل (${form.currency})`}
            type="number"
            min="0"
            step="1"
            value={form.shippingFee}
            onChange={set('shippingFee')}
          />
          <Input
            label={`حد الشحن المجاني (${form.currency})`}
            type="number"
            min="0"
            step="50"
            value={form.freeShippingThreshold}
            onChange={set('freeShippingThreshold')}
          />
        </div>
        <p className="mt-3 rounded-xl bg-pasha-50 px-3 py-2 text-[11px] font-semibold text-pasha-800">
          <i className="fa-solid fa-circle-info ml-1" />
          الشحن مجاني للطلبات التي تتجاوز {form.freeShippingThreshold} {form.currency}،
          والدفع دائماً عند الاستلام.
        </p>
      </AdminCard>

      <AdminCard
        title="أمان لوحة التحكم"
        description="غيّر كلمة مرور الأدمن — تُحفظ محلياً في هذا المتصفح"
        icon="fa-shield-halved"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="كلمة مرور جديدة"
            type="password"
            value={form.newPassword}
            onChange={set('newPassword')}
            placeholder="اتركها فارغة للإبقاء على الحالية"
            autoComplete="new-password"
          />
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-[11px] leading-relaxed text-amber-800">
            <i className="fa-solid fa-lock ml-1" />
            كلمة المرور الحالية محفوظة في إعدادات المتجر. أي شخص يملك وصولاً لهذا
            المتصفح يمكنه الوصول للوحة التحكم.
          </div>
        </div>
      </AdminCard>

      <AdminCard
        title="البيانات والنسخ الاحتياطي"
        description="بيانات المتجر محفوظة محلياً (localStorage) في هذا المتصفح"
        icon="fa-database"
      >
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={exportData}
            className="flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-200"
          >
            <i className="fa-solid fa-download" />
            تنزيل نسخة JSON
          </button>
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className="flex items-center gap-2 rounded-xl bg-rose-50 px-4 py-2.5 text-xs font-bold text-rose-600 transition hover:bg-rose-100"
          >
            <i className="fa-solid fa-rotate-left" />
            استعادة البيانات الافتراضية
          </button>
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-slate-400">
          ملاحظة: هذا الإصدار يعمل بدون خادم — المنتجات والطلبات والإعدادات تُخزَّن في
          متصفحك فقط. للاستخدام التجاري مع عدة أجهزة، اربط المشروع بقاعدة بيانات
          (Supabase أو Firebase) لاحقاً.
        </p>
      </AdminCard>

      <div className="sticky bottom-4 flex justify-end">
        <button
          type="submit"
          className="btn-shine flex items-center gap-2 rounded-2xl bg-pasha-600 px-7 py-3 text-sm font-extrabold text-white shadow-lg transition hover:bg-pasha-700"
        >
          <i className="fa-solid fa-floppy-disk" />
          حفظ الإعدادات
        </button>
      </div>

      <ConfirmDialog
        open={confirmReset}
        title="استعادة البيانات الافتراضية"
        message="سيتم مسح المنتجات والطلبات والتعديلات الحالية واستعادة بيانات المتجر الأصلية. هل أنت متأكد؟"
        confirmLabel="نعم، استعد الافتراضي"
        onCancel={() => setConfirmReset(false)}
        onConfirm={reset}
      />
    </form>
  );
}
