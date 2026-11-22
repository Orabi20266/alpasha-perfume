import { useMemo, useState } from 'react';
import ProductArt from '../../components/ui/ProductArt';
import ImageUploader from '../../components/admin/ImageUploader';
import {
  AdminCard,
  ConfirmDialog,
  Input,
  Select,
  Textarea,
  Toggle,
} from '../../components/admin/ui';
import { useStore } from '../../store/StoreContext';
import { STORAGE_KEYS } from '../../lib/storage';
import { CATEGORIES, categoryLabel } from '../../data/seed';
import { ART_OPTIONS } from '../../data/art';
import { fitsInStorage, money } from '../../lib/format';

const blankProduct = {
  name: '',
  sku: '',
  category: 'oud',
  price: '',
  oldPrice: '',
  stock: 10,
  rating: 5,
  reviews: 0,
  badge: 'جديد',
  badgeType: 'new',
  art: 'royalOud',
  imageUrl: '',
  description: '',
  specs: [],
  featured: false,
};

function ProductForm({ product, onClose }) {
  const { saveProduct, toast, settings, products } = useStore();
  const isNew = !product?.id;
  const [form, setForm] = useState(() => ({
    ...blankProduct,
    ...(product || {}),
    price: product?.price ?? '',
    oldPrice: product?.oldPrice ?? '',
    specsText: (product?.specs || []).join('\n'),
  }));
  const [errors, setErrors] = useState({});

  const set = (key) => (event) => {
    const value =
      event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const submit = (event) => {
    event.preventDefault();
    const next = {};
    if (!form.name.trim()) next.name = 'اسم المنتج مطلوب';
    if (!form.sku.trim()) next.sku = 'رمز المنتج (SKU) مطلوب';
    if (!Number(form.price) || Number(form.price) <= 0) {
      next.price = 'أدخل سعراً صحيحاً أكبر من صفر';
    }
    if (form.oldPrice && Number(form.oldPrice) <= Number(form.price)) {
      next.oldPrice = 'السعر القديم يجب أن يكون أكبر من السعر الحالي';
    }
    setErrors(next);
    if (Object.keys(next).length) return;

    const finalProduct = {
      ...form,
      name: form.name.trim(),
      sku: form.sku.trim().toUpperCase(),
      price: Number(form.price),
      oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
      stock: Number(form.stock) || 0,
      rating: Math.min(5, Math.max(0, Number(form.rating) || 0)),
      reviews: Number(form.reviews) || 0,
      specs: form.specsText
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean),
      featured: Boolean(form.featured),
      specsText: undefined,
    };

    const nextProducts = product?.id
      ? products.map((item) =>
          item.id === product.id ? { ...item, ...finalProduct } : item,
        )
      : [
          {
            ...finalProduct,
            id: products.reduce((max, item) => Math.max(max, item.id), 0) + 1,
          },
          ...products,
        ];

    if (!fitsInStorage(STORAGE_KEYS.products, nextProducts)) {
      toast(
        'مساحة التخزين ممتلئة، تعذّر حفظ الصورة. جرّب صورة أصغر أو احذف صور منتجات قديمة.',
        { type: 'error' },
      );
      return;
    }

    saveProduct(finalProduct);
    toast(isNew ? 'تمت إضافة المنتج بنجاح.' : 'تم تحديث بيانات المنتج.', {
      type: 'success',
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex animate-fadeIn items-center justify-center bg-pasha-950/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <form
        onSubmit={submit}
        className="max-h-[92vh] w-full max-w-3xl animate-scaleIn overflow-y-auto rounded-3xl bg-white shadow-2xl"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between bg-gradient-to-l from-pasha-900 to-pasha-700 px-6 py-4 text-white">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-box-open text-pasha-300" />
            <h3 className="text-base font-extrabold">
              {isNew ? 'إضافة منتج جديد' : 'تعديل بيانات المنتج'}
            </h3>
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
          <div className="flex items-center gap-4 rounded-2xl border border-pasha-100 bg-pasha-50/60 p-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-white p-2 shadow-sm">
              <ProductArt
                product={{ art: form.art, name: form.name, imageUrl: form.imageUrl }}
                className="h-full w-full"
              />
            </div>
            <div className="min-w-0">
              <span className="block truncate text-sm font-extrabold text-pasha-950">
                {form.name || 'اسم المنتج سيظهر هنا'}
              </span>
              <span className="block text-[11px] text-slate-500">
                {form.sku || 'SKU'} · {categoryLabel(form.category)}
              </span>
              <span className="mt-1 block text-sm font-black text-pasha-700">
                {form.price ? money(form.price, settings.currency) : money(0, settings.currency)}
              </span>
            </div>
          </div>

          <Input
            label="اسم المنتج"
            required
            value={form.name}
            onChange={set('name')}
            placeholder="مثال: عطر عود ملكي فاخر — Royal Oud 100 مل"
            error={errors.name}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="رمز المنتج (SKU)"
              required
              dir="ltr"
              value={form.sku}
              onChange={set('sku')}
              placeholder="AP-OUD-100"
              error={errors.sku}
            />
            <Select label="القسم" value={form.category} onChange={set('category')}>
              {CATEGORIES.filter((category) => category.id !== 'all').map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Input
              label={`السعر (${settings.currency})`}
              required
              type="number"
              min="1"
              step="1"
              value={form.price}
              onChange={set('price')}
              placeholder="320"
              error={errors.price}
            />
            <Input
              label={`السعر القديم (${settings.currency})`}
              type="number"
              min="0"
              step="1"
              value={form.oldPrice}
              onChange={set('oldPrice')}
              placeholder="390"
              hint="اتركه فارغاً بدون خصم"
              error={errors.oldPrice}
            />
            <Input
              label="المخزون"
              type="number"
              min="0"
              step="1"
              value={form.stock}
              onChange={set('stock')}
            />
            <Input
              label="التقييم (0-5)"
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={form.rating}
              onChange={set('rating')}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Input
              label="عدد التقييمات"
              type="number"
              min="0"
              value={form.reviews}
              onChange={set('reviews')}
            />
            <Input
              label="شارة المنتج"
              value={form.badge}
              onChange={set('badge')}
              placeholder="الأكثر مبيعاً"
            />
            <Select label="لون الشارة" value={form.badgeType} onChange={set('badgeType')}>
              <option value="bestseller">عنابي (الأكثر مبيعاً)</option>
              <option value="discount">ذهبي (خصم)</option>
              <option value="new">أخضر (جديد)</option>
            </Select>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select label="الرسم التوضيحي" value={form.art} onChange={set('art')}>
              {ART_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <div className="flex items-center rounded-2xl border border-pasha-100 bg-pasha-50/40 p-3 text-[11px] leading-relaxed text-pasha-900">
              <i className="fa-solid fa-circle-info ml-2 text-base text-pasha-500" />
              إن لم ترفع صورة من جهازك، سيظهر الرسم التوضيحي المختار تلقائياً.
            </div>
          </div>

          <ImageUploader
            value={form.imageUrl}
            onChange={(dataUrl) => {
              setForm((current) => ({ ...current, imageUrl: dataUrl }));
              setErrors((current) => ({ ...current, imageUrl: undefined }));
            }}
            art={form.art}
            name={form.name}
          />

          <Textarea
            label="الوصف"
            rows="2"
            value={form.description}
            onChange={set('description')}
            placeholder="وصف عطري مختصر للمنتج..."
          />

          <Textarea
            label="المواصفات"
            rows="4"
            value={form.specsText}
            onChange={set('specsText')}
            placeholder={'مواصفة في كل سطر\nالحجم: 100 مل — Eau de Parfum\nالمقدمة: زعفران وبرغموت'}
            hint="اكتب كل مواصفة في سطر مستقل"
          />

          <Toggle
            checked={Boolean(form.featured)}
            onChange={(value) => setForm((current) => ({ ...current, featured: value }))}
            label="منتج مميز"
            description="يظهر في مقدمة الترتيب الافتراضي للمتجر"
          />
        </div>

        <div className="sticky bottom-0 flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-white px-5 py-2.5 text-xs font-bold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-100"
          >
            إلغاء
          </button>
          <button
            type="submit"
            className="btn-shine flex items-center gap-2 rounded-xl bg-pasha-600 px-6 py-2.5 text-sm font-extrabold text-white shadow transition hover:bg-pasha-700"
          >
            <i className="fa-solid fa-floppy-disk" />
            {isNew ? 'إضافة المنتج' : 'حفظ التعديلات'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function ProductsPanel() {
  const { products, deleteProduct, toast, settings } = useStore();
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return products;
    return products.filter((product) =>
      [product.name, product.sku, categoryLabel(product.category)]
        .join(' ')
        .toLowerCase()
        .includes(value),
    );
  }, [products, query]);

  const handleDelete = () => {
    if (!toDelete) return;
    deleteProduct(toDelete.id);
    toast(`تم حذف المنتج "${toDelete.name}".`, { type: 'success' });
    setToDelete(null);
  };

  return (
    <div className="space-y-4">
      <AdminCard
        title="إدارة المنتجات"
        description={`${products.length} منتج في المتجر — أضف وعدّل الأسعار والمواصفات`}
        icon="fa-boxes-stacked"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <i className="fa-solid fa-magnifying-glass pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="ابحث بالاسم أو SKU..."
                className="w-44 rounded-xl border border-slate-200 bg-slate-50 py-2 pl-3 pr-8 text-xs focus:border-pasha-500 focus:bg-white focus:outline-none sm:w-56"
              />
            </div>
            <button
              type="button"
              onClick={() => setEditing({ ...blankProduct })}
              className="flex items-center gap-2 rounded-xl bg-pasha-600 px-4 py-2 text-xs font-extrabold text-white transition hover:bg-pasha-700"
            >
              <i className="fa-solid fa-plus" />
              منتج جديد
            </button>
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-right text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] uppercase text-slate-400">
                <th className="pb-3 font-bold">المنتج</th>
                <th className="pb-3 font-bold">القسم</th>
                <th className="pb-3 font-bold">السعر</th>
                <th className="pb-3 font-bold">المخزون</th>
                <th className="pb-3 font-bold">الحالة</th>
                <th className="pb-3 font-bold">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((product) => (
                <tr key={product.id} className="transition hover:bg-slate-50/60">
                  <td className="py-3 pl-2">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-pasha-50/50 p-1">
                        <ProductArt product={product} className="h-full w-full" />
                      </div>
                      <div className="min-w-0">
                        <p className="line-clamp-1 max-w-[260px] font-bold text-slate-800">
                          {product.name}
                        </p>
                        <p className="font-mono text-[10px] text-slate-400">{product.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className="rounded-lg bg-pasha-50 px-2 py-1 text-[10px] font-bold text-pasha-700">
                      {categoryLabel(product.category)}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className="font-black text-pasha-800">
                      {money(product.price, settings.currency)}
                    </span>
                    {product.oldPrice ? (
                      <span className="block text-[10px] text-slate-400 line-through">
                        {money(product.oldPrice, settings.currency)}
                      </span>
                    ) : null}
                  </td>
                  <td className="py-3">
                    <span
                      className={`rounded-lg px-2 py-1 text-[10px] font-bold ${
                        Number(product.stock) > 5
                          ? 'bg-emerald-50 text-emerald-600'
                          : Number(product.stock) > 0
                            ? 'bg-amber-50 text-amber-600'
                            : 'bg-rose-50 text-rose-600'
                      }`}
                    >
                      {Number(product.stock) > 0
                        ? `${product.stock} قطعة`
                        : 'نفد المخزون'}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex flex-wrap gap-1">
                      {product.featured && (
                        <span className="rounded-md bg-pasha-100 px-1.5 py-0.5 text-[9px] font-bold text-pasha-700">
                          مميز
                        </span>
                      )}
                      {product.oldPrice > product.price && (
                        <span className="rounded-md bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-700">
                          خصم {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setEditing(product)}
                        aria-label="تعديل"
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-pasha-50 text-pasha-600 transition hover:bg-pasha-100"
                      >
                        <i className="fa-solid fa-pen text-[11px]" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setToDelete(product)}
                        aria-label="حذف"
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-500 transition hover:bg-rose-100"
                      >
                        <i className="fa-solid fa-trash text-[11px]" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!filtered.length && (
            <div className="py-12 text-center text-xs text-slate-400">
              <i className="fa-solid fa-box-open mb-2 block text-2xl text-slate-300" />
              لا توجد منتجات مطابقة للبحث.
            </div>
          )}
        </div>
      </AdminCard>

      {editing && (
        <ProductForm product={editing} onClose={() => setEditing(null)} />
      )}

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="حذف المنتج"
        message={`سيتم حذف "${toDelete?.name || ''}" من المتجر والسلة والعروضات. لا يمكن التراجع.`}
        confirmLabel="نعم، احذف"
        onCancel={() => setToDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
