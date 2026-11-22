import { useState } from 'react';
import { AdminCard, Input } from '../../components/admin/ui';
import { useStore } from '../../store/StoreContext';
import { digitsOnly, waLink } from '../../lib/format';

const SOCIAL_FIELDS = [
  { key: 'facebook', label: 'فيسبوك', icon: 'fa-facebook-f', chip: 'text-[#1877f2]', placeholder: 'https://www.facebook.com/...' },
  { key: 'instagram', label: 'إنستغرام', icon: 'fa-instagram', chip: 'text-pink-500', placeholder: 'https://www.instagram.com/...' },
  { key: 'x', label: 'إكس (تويتر)', icon: 'fa-x-twitter', chip: 'text-slate-800', placeholder: 'https://x.com/...' },
  { key: 'linkedin', label: 'لينكدإن', icon: 'fa-linkedin-in', chip: 'text-[#0a66c2]', placeholder: 'https://www.linkedin.com/...' },
  { key: 'tiktok', label: 'تيك توك', icon: 'fa-tiktok', chip: 'text-slate-900', placeholder: 'https://www.tiktok.com/@...' },
];

export default function SocialPanel() {
  const { settings, updateSettings, toast } = useStore();
  const [form, setForm] = useState(() => ({ ...settings, social: { ...settings.social } }));

  const set = (key) => (event) =>
    setForm((current) => ({ ...current, [key]: event.target.value }));

  const setSocial = (key) => (event) =>
    setForm((current) => ({
      ...current,
      social: { ...current.social, [key]: event.target.value },
    }));

  const save = (event) => {
    event.preventDefault();
    if (digitsOnly(form.whatsapp).length < 8) {
      toast('رقم واتساب غير صحيح. أدخل الرقم مع رمز الدولة.', { type: 'error' });
      return;
    }
    updateSettings({
      whatsapp: digitsOnly(form.whatsapp),
      whatsappDisplay: form.whatsappDisplay || form.whatsapp,
      phone: form.phone,
      email: form.email,
      address: form.address,
      hours: form.hours,
      payments: form.payments,
      social: form.social,
    });
    toast('تم تحديث بيانات التواصل والسوشيال ميديا.', { type: 'success' });
  };

  return (
    <form onSubmit={save} className="space-y-4">
      <AdminCard
        title="واتساب وبيانات التواصل"
        description="تظهر هذه البيانات في الهيدر والفوتر وأزرار الطلب"
        icon="fa-headset"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="رقم واتساب (أرقام فقط مع رمز الدولة)"
            required
            dir="ltr"
            value={form.whatsapp}
            onChange={set('whatsapp')}
            placeholder="970568183222"
            hint="يُستخدم في رابط wa.me وأزرار الطلب"
          />
          <Input
            label="رقم واتساب كما يظهر للزوار"
            dir="ltr"
            value={form.whatsappDisplay}
            onChange={set('whatsappDisplay')}
            placeholder="+970 568 183 222"
          />
          <Input
            label="رقم الهاتف"
            dir="ltr"
            value={form.phone}
            onChange={set('phone')}
            placeholder="+970 568 183 222"
          />
          <Input
            label="البريد الإلكتروني"
            type="email"
            dir="ltr"
            value={form.email}
            onChange={set('email')}
            placeholder="info@pasha-build.com"
          />
          <div className="sm:col-span-2">
            <Input
              label="العنوان / مناطق التوصيل"
              value={form.address}
              onChange={set('address')}
            />
          </div>
          <Input
            label="ساعات العمل"
            value={form.hours}
            onChange={set('hours')}
          />
          <Input
            label="ملاحظة طرق الدفع"
            value={form.payments}
            onChange={set('payments')}
            hint="تظهر بجانب خيار الدفع عند الاستلام"
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-3 text-xs">
          <i className="fa-brands fa-whatsapp text-xl text-emerald-600" />
          <span className="font-bold text-emerald-800">
            رابط مباشر:{' '}
            <a
              href={waLink(form.whatsapp)}
              target="_blank"
              rel="noreferrer"
              dir="ltr"
              className="font-mono underline"
            >
              wa.me/{digitsOnly(form.whatsapp) || '...'}
            </a>
          </span>
        </div>
      </AdminCard>

      <AdminCard
        title="صفحات السوشيال ميديا"
        description="أضف روابط صفحات الباشا الرسمية — اترك الحقل فارغاً لإخفاء الأيقونة"
        icon="fa-share-nodes"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {SOCIAL_FIELDS.map((field) => (
            <div key={field.key} className="relative">
              <span
                className={`pointer-events-none absolute right-3 top-[34px] text-sm ${field.chip}`}
              >
                <i className={`fa-brands ${field.icon}`} />
              </span>
              <Input
                label={field.label}
                dir="ltr"
                value={form.social[field.key] || ''}
                onChange={setSocial(field.key)}
                placeholder={field.placeholder}
                className="pr-9"
              />
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-[11px] font-semibold text-slate-500">
          <i className="fa-solid fa-circle-info ml-1 text-pasha-600" />
          صفحة فيسبوك الحالية:{' '}
          {form.social.facebook ? (
            <a
              href={form.social.facebook}
              target="_blank"
              rel="noreferrer"
              className="break-all text-pasha-700 underline"
              dir="ltr"
            >
              {form.social.facebook}
            </a>
          ) : (
            'غير مضافة'
          )}
        </div>
      </AdminCard>

      <div className="sticky bottom-4 flex justify-end">
        <button
          type="submit"
          className="btn-shine flex items-center gap-2 rounded-2xl bg-pasha-600 px-7 py-3 text-sm font-extrabold text-white shadow-lg transition hover:bg-pasha-700"
        >
          <i className="fa-solid fa-floppy-disk" />
          حفظ بيانات التواصل
        </button>
      </div>
    </form>
  );
}
