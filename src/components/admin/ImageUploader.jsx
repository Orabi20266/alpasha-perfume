import { useRef, useState } from 'react';
import ProductArt from '../ui/ProductArt';
import { fileToOptimizedDataUrl } from '../../lib/image';

const errorMessage = (code) => {
  if (code === 'type') return 'الملف المختار ليس صورة صالحة.';
  if (code === 'size') return 'حجم الصورة أكبر من 10 ميجابايت، اختر صورة أصغر.';
  if (code === 'large') return 'تعذّر ضغط الصورة بدرجة كافية، جرّب صورة أبسط أو أصغر.';
  return 'تعذّرت قراءة الصورة، جرّب صورة أخرى.';
};

export default function ImageUploader({
  value,
  onChange,
  art,
  name,
  disabled = false,
}) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);

  const handleFile = async (file) => {
    if (!file || busy) return;
    setError('');
    setBusy(true);
    try {
      const dataUrl = await fileToOptimizedDataUrl(file);
      onChange(dataUrl);
      setFileName(file.name || 'صورة المنتج');
    } catch (exception) {
      setError(errorMessage(exception?.message));
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const remove = () => {
    onChange('');
    setFileName('');
    setError('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div>
      <span className="mb-1 block text-xs font-bold text-slate-700">
        صورة المنتج
      </span>
      <div
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          if (disabled) return;
          handleFile(event.dataTransfer?.files?.[0]);
        }}
        className={`flex flex-col gap-3 rounded-2xl border-2 border-dashed p-3 transition sm:flex-row sm:items-center ${
          dragging
            ? 'border-pasha-400 bg-pasha-50'
            : 'border-pasha-200 bg-pasha-50/40'
        }`}
      >
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-white p-2 shadow-sm">
          <ProductArt
            product={{ art, name, imageUrl: value }}
            className="h-full w-full"
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-extrabold text-slate-800">
            {value
              ? fileName || 'صورة مرفوعة من الجهاز'
              : 'لم تُرفع صورة — سيُستخدم الرسم التوضيحي'}
          </p>
          <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">
            {value
              ? 'الصورة محفوظة داخل بيانات المتجر في هذا المتصفح.'
              : 'اسحب الصورة هنا أو اخترها من جهازك. JPG أو PNG أو WebP حتى 10 ميجابايت، وتُضغط تلقائياً.'}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={disabled || busy}
              onClick={() => inputRef.current?.click()}
              className="flex items-center gap-1.5 rounded-lg bg-pasha-600 px-3 py-1.5 text-[11px] font-extrabold text-white transition hover:bg-pasha-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy ? (
                <i className="fa-solid fa-spinner animate-spin" />
              ) : (
                <i className="fa-solid fa-upload" />
              )}
              {busy ? 'جارٍ تجهيز الصورة...' : value ? 'تغيير الصورة' : 'رفع صورة'}
            </button>
            {value && (
              <button
                type="button"
                disabled={disabled || busy}
                onClick={remove}
                className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-[11px] font-bold text-rose-600 ring-1 ring-rose-200 transition hover:bg-rose-50 disabled:opacity-60"
              >
                <i className="fa-solid fa-trash-can" />
                إزالة الصورة
              </button>
            )}
          </div>
          {error && (
            <p className="mt-2 text-[11px] font-semibold text-rose-500">{error}</p>
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/avif,image/svg+xml"
        className="hidden"
        onChange={(event) => handleFile(event.target.files?.[0])}
        aria-label="اختيار صورة المنتج من الجهاز"
      />
    </div>
  );
}
