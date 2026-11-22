import Reveal from '../ui/Reveal';
import Stars from '../ui/Stars';

const REVIEWS = [
  {
    name: 'أ. سامي أبو ريا',
    role: 'عاشق للعود — رام الله',
    text: 'طلبت دهن عود كمبودي ووصلني بتغليف فاخر خلال يومين، والرائحة أصلية وثابتة. الدفع كان عند الاستلام وتجربة ممتازة من البداية للنهاية.',
    rating: 5,
  },
  {
    name: 'أ. لينا حجازي',
    role: 'عميلة — نابلس',
    text: 'عطر الورد الطائفي صار توقيعي اليومي، ثباته ممتاز ورائحته راقية. الدعم على واتساب ساعدني أختار العطر المناسب لطبيعة بشرتي.',
    rating: 5,
  },
  {
    name: 'أ. خالد منصور',
    role: 'عميل — الخليل',
    text: 'طقم الهدايا الملكي كان مفاجأة رائعة لزوجتي، والتغليف والبطاقة أضافوا لمسة شخصية. أعجبني أن الطلب كله يتم من الموقع والتأكيد عبر واتساب.',
    rating: 4,
  },
];

export default function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8">
      <Reveal className="mb-6 text-center">
        <span className="text-xs font-extrabold uppercase tracking-wider text-pasha-600">
          آراء عملاء الباشا
        </span>
        <h2 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">
          ثقة تُبنى مع كل رائحة
        </h2>
      </Reveal>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {REVIEWS.map((review, index) => (
          <Reveal
            key={review.name}
            delay={index * 100}
            className="group relative rounded-3xl border border-slate-200 bg-white p-6 shadow-card transition hover:-translate-y-1 hover:border-pasha-200 hover:shadow-soft"
          >
            <i className="fa-solid fa-quote-right absolute left-5 top-5 text-2xl text-pasha-100 transition group-hover:text-pasha-200" />
            <Stars rating={review.rating} className="text-sm" />
            <p className="mt-3 min-h-[84px] text-xs leading-relaxed text-slate-600">
              “{review.text}”
            </p>
            <div className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pasha-100 text-sm font-black text-pasha-700">
                {review.name.replace('أ. ', '').charAt(0)}
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-slate-800">{review.name}</h4>
                <p className="text-[11px] text-slate-400">{review.role}</p>
              </div>
              <span className="mr-auto flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                <i className="fa-solid fa-circle-check" /> موثّق
              </span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
