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
        <span className="section-eyebrow">
          آراء عملاء الباشا
        </span>
        <h2 className="mt-2 display text-3xl text-ink sm:text-4xl">
          ثقة تُبنى مع كل رائحة
        </h2>
      </Reveal>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {REVIEWS.map((review, index) => (
          <Reveal
            key={review.name}
            delay={index * 100}
            className="group relative rounded-2xl border border-line bg-white p-6 shadow-card transition hover:-translate-y-1 hover:border-gold-300 hover:shadow-lift"
          >
            <i className="fa-solid fa-quote-right absolute left-5 top-5 text-2xl text-gold-200 transition group-hover:text-gold-300" />
            <Stars rating={review.rating} className="text-sm" />
            <p className="mt-3 min-h-[84px] text-xs leading-relaxed text-slate-600">
              “{review.text}”
            </p>
            <div className="mt-4 flex items-center gap-3 border-t border-line pt-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-100 text-sm font-bold text-gold-800">
                {review.name.replace('أ. ', '').charAt(0)}
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-ink">{review.name}</h4>
                <p className="text-[11px] text-slate-400">{review.role}</p>
              </div>
              <span className="mr-auto flex items-center gap-1 rounded-full bg-gold-50 px-2 py-0.5 text-[10px] font-bold text-gold-700">
                <i className="fa-solid fa-circle-check" /> موثّق
              </span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
