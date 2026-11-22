import { useState } from 'react';
import { Link } from 'react-router-dom';
import ProductArt from '../../components/ui/ProductArt';
import { AdminCard, Input, Textarea, Select } from '../../components/admin/ui';
import { useStore } from '../../store/StoreContext';
import { money } from '../../lib/format';
import { normalizeTiers } from '../../lib/discount';

export default function OffersPanel() {
  const { offers, products, settings, updateOffers, toast } = useStore();
  const [form, setForm] = useState(() => ({
    ...offers,
    tiers: offers.tiers?.length ? offers.tiers : [],
  }));

  const set = (key) => (event) =>
    setForm((current) => ({ ...current, [key]: event.target.value }));

  const setTier = (index, key, value) => {
    setForm((current) => {
      const tiers = [...(current.tiers || [])];
      tiers[index] = { ...tiers[index], [key]: Math.max(0, Number(value) || 0) };
      return { ...current, tiers };
    });
  };

  const addTier = () => {
    setForm((current) => {
      const tiers = [...(current.tiers || [])];
      const last = tiers[tiers.length - 1] || { threshold: 0, percent: 0 };
      return {
        ...current,
        tiers: [
          ...tiers,
          {
            threshold: Number(last.threshold || 0) + 500,
            percent: Math.min(50, Number(last.percent || 0) + 5),
          },
        ],
      };
    });
  };

  const removeTier = (index) => {
    setForm((current) => ({
      ...current,
      tiers: (current.tiers || []).filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const toggleProduct = (id) => {
    setForm((current) => {
      const exists = current.productIds.includes(id);
      return {
        ...current,
        productIds: exists
          ? current.productIds.filter((item) => item !== id)
          : [...current.productIds, id],
      };
    });
  };

  const save = (event) => {
    event.preventDefault();
    if (!form.title.trim() || !form.heroTitle.trim()) {
      toast('عنوان صفحة العروضات وعنوان الواجهة مطلوبان.', { type: 'error' });
      return;
    }
    const tiers = normalizeTiers(form.tiers);
    if (!tiers.length) {
      toast('أضف شريحة خصم واحدة على الأقل لعروض الموسم.', { type: 'error' });
      return;
    }
    const clean = { ...form };
    delete clean.couponCode;
    delete clean.couponNote;
    updateOffers({
      ...clean,
      tiers,
      productIds: (form.productIds || []).map(Number),
      spotlightProductId: form.spotlightProductId
        ? Number(form.spotlightProductId)
        : null,
    });
    toast('تم حفظ عروض الموسم وتحديث المتجر.', { type: 'success' });
  };


  const spotlight = products.find(
    (product) => product.id === Number(form.spotlightProductId),
  );

  return (
    <form onSubmit={save} className="space-y-4">
      <AdminCard
        title="صفحة العروضات"
        description="تحكم في محتوى صفحة العروضات والبانر الرئيسي للمتجر"
        icon="fa-tags"
        actions={
          <Link
            to="/offers"
            target="_blank"
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] font-bold text-slate-600 transition hover:border-pasha-300 hover:text-pasha-700"
          >
            <i className="fa-solid fa-up-right-from-square" />
            معاينة الصفحة
          </Link>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="عنوان العروضات"
            required
            value={form.title}
            onChange={set('title')}
            placeholder="عروض العطور"
          />
          <Input
            label="شارة العرض"
            value={form.badge}
            onChange={set('badge')}
            placeholder="عرض هذا الأسبوع"
          />
        </div>
        <div className="mt-4">
          <Textarea
            label="وصف صفحة العروضات"
            rows="3"
            value={form.subtitle}
            onChange={set('subtitle')}
          />
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="تاريخ انتهاء العروض"
            type="date"
            value={form.endDate}
            onChange={set('endDate')}
            hint="يظهر في قسم عروض الموسم بالصفحة الرئيسية"
          />
          <Input
            label="شريط الإعلان أعلى المتجر"
            value={form.announcement}
            onChange={set('announcement')}
            hint="يظهر في الشريط الأعلى لجميع الصفحات"
          />
        </div>
        <div className="mt-4">
          <Textarea
            label="ملاحظة شروط الخصم"
            rows="2"
            value={form.yearEndNote}
            onChange={set('yearEndNote')}
            hint="تظهر أسفل شرائح الخصم في الصفحة الرئيسية وصفحة العروضات"
          />
        </div>
      </AdminCard>

      <AdminCard
        title="عروض الموسم — شرائح الخصم"
        description="خصم تلقائي على مجموع السلة بدون كود خصم. تُطبق الشريحة المناسبة لقيمة الطلب، وتتناقص النسبة مع ارتفاع القيمة."
        icon="fa-percent"
        actions={
          <button
            type="button"
            onClick={addTier}
            className="flex items-center gap-2 rounded-xl bg-pasha-600 px-3 py-2 text-[11px] font-bold text-white transition hover:bg-pasha-700"
          >
            <i className="fa-solid fa-plus" />
            إضافة شريحة
          </button>
        }
      >
        {form.tiers?.length ? (
          <div className="space-y-2">
            {form.tiers.map((tier, index) => (
              <div
                key={`tier-${index}`}
                className="flex flex-wrap items-end gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-3"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-pasha-100 text-[11px] font-black text-pasha-800">
                  {index + 1}
                </span>
                <label className="min-w-[130px] flex-1">
                  <span className="mb-1 block text-[10px] font-bold text-slate-500">
                    عند شراء (قيمة السلة)
                  </span>
                  <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-2">
                    <input
                      type="number"
                      min="0"
                      step="50"
                      value={tier.threshold}
                      onChange={(event) => setTier(index, 'threshold', event.target.value)}
                      className="w-full bg-transparent py-2 text-sm font-bold text-slate-800 focus:outline-none"
                    />
                    <span className="text-xs font-black text-pasha-600">
                      {settings.currency}
                    </span>
                  </div>
                </label>
                <label className="min-w-[100px] flex-1">
                  <span className="mb-1 block text-[10px] font-bold text-slate-500">
                    نسبة الخصم
                  </span>
                  <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-2">
                    <input
                      type="number"
                      min="1"
                      max="90"
                      step="1"
                      value={tier.percent}
                      onChange={(event) => setTier(index, 'percent', event.target.value)}
                      className="w-full bg-transparent py-2 text-sm font-bold text-slate-800 focus:outline-none"
                    />
                    <span className="text-xs font-black text-pasha-600">%</span>
                  </div>
                </label>
                <div className="rounded-xl bg-white px-3 py-2 text-[11px] font-bold text-emerald-700 ring-1 ring-emerald-100">
                  وفر {money(Math.round((Number(tier.threshold || 0) * Number(tier.percent || 0)) / 100), settings.currency)}
                  <span className="block text-[9px] font-normal text-slate-400">
                    عند بلوغ الشريحة
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeTier(index)}
                  aria-label="حذف الشريحة"
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-500 transition hover:bg-rose-100"
                >
                  <i className="fa-solid fa-trash text-[11px]" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center">
            <i className="fa-solid fa-percent mb-2 block text-2xl text-slate-300" />
            <p className="text-xs text-slate-500">
              لا توجد شرائح خصم. أضف شريحة لتفعيل عروض الموسم.
            </p>
          </div>
        )}
        <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-[11px] font-semibold text-amber-800">
          <i className="fa-solid fa-circle-info ml-1" />
          مثال: شريحة 350 ← 10% تعني أن أي طلب بقيمة 350 أو أكثر يحصل على خصم
          10%، وإذا وصل الطلب إلى 600 ينتقل تلقائياً إلى شريحة 5%. تُرتّب الشرائح
          تصاعدياً حسب قيمة الطلب، والنسب تتناقص كلما زادت القيمة.
        </p>
      </AdminCard>

      <AdminCard
        title="بانر الواجهة الرئيسية"
        description="النصوص التي تظهر في أعلى الصفحة الرئيسية"
        icon="fa-image"
      >
        <div className="grid grid-cols-1 gap-4">
          <Input
            label="الشارة العلوية"
            value={form.heroBadge}
            onChange={set('heroBadge')}
          />
          <Input
            label="العنوان الرئيسي"
            required
            value={form.heroTitle}
            onChange={set('heroTitle')}
            hint="اكتب كلمة AL PASHA ضمن العنوان ليتم تلوينها تلقائياً"
          />
          <Textarea
            label="النص التعريفي"
            rows="3"
            value={form.heroText}
            onChange={set('heroText')}
          />
          <Select
            label="المنتج المميز في البانر"
            value={form.spotlightProductId || ''}
            onChange={set('spotlightProductId')}
          >
            <option value="">بدون منتج مميز</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </Select>
        </div>

        {spotlight && (
          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-pasha-100 bg-pasha-50/60 p-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white p-1.5">
              <ProductArt product={spotlight} className="h-full w-full" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-pasha-950">
                {spotlight.name}
              </p>
              <p className="text-[11px] text-slate-500">
                {money(spotlight.price, settings.currency)}
              </p>
            </div>
          </div>
        )}
      </AdminCard>

      <AdminCard
        title="المنتجات المشمولة بالعرض"
        description={`${form.productIds.length} منتج مختار — تظهر في صفحة العروضات وقسم العروض بالرئيسية`}
        icon="fa-list-check"
        actions={
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() =>
                setForm((current) => ({
                  ...current,
                  productIds: products.map((product) => product.id),
                }))
              }
              className="rounded-lg bg-pasha-50 px-3 py-1.5 text-[10px] font-bold text-pasha-700 transition hover:bg-pasha-100"
            >
              تحديد الكل
            </button>
            <button
              type="button"
              onClick={() => setForm((current) => ({ ...current, productIds: [] }))}
              className="rounded-lg bg-slate-100 px-3 py-1.5 text-[10px] font-bold text-slate-600 transition hover:bg-slate-200"
            >
              إلغاء الكل
            </button>
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => {
            const checked = form.productIds.includes(product.id);
            return (
              <label
                key={product.id}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-2.5 transition ${
                  checked
                    ? 'border-pasha-400 bg-pasha-50'
                    : 'border-slate-200 bg-white hover:border-pasha-200'
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleProduct(product.id)}
                  className="h-4 w-4 shrink-0 accent-pasha-600"
                />
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-50 p-1">
                  <ProductArt product={product} className="h-full w-full" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11px] font-bold text-slate-800">
                    {product.name}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {money(product.price, settings.currency)}
                  </p>
                </div>
              </label>
            );
          })}
        </div>
      </AdminCard>

      <div className="sticky bottom-4 flex justify-end">
        <button
          type="submit"
          className="btn-shine flex items-center gap-2 rounded-2xl bg-pasha-600 px-7 py-3 text-sm font-extrabold text-white shadow-lg transition hover:bg-pasha-700"
        >
          <i className="fa-solid fa-floppy-disk" />
          حفظ إعدادات العروضات
        </button>
      </div>
    </form>
  );
}
