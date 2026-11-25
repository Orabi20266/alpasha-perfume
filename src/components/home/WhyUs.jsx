import Reveal from '../ui/Reveal';

const FEATURES = [
  {
    icon: 'fa-spray-can-sparkles',
    title: 'عطور شرقية وفرنسية',
    text: 'تشكيلة مختارة من العطور الشرقية والفرنسية بتركيزات عالية وثبات طويل، تناسب كل مناسبة ومزاج.',
  },
  {
    icon: 'fa-tree',
    title: 'عود ودهن عود أصلي',
    text: 'عود كمبودي وهندي ودهن عود مركّز معتّق بعناية، مع ضمان الأصالة لكل قطرة تصل إليك.',
  },
  {
    icon: 'fa-fire',
    title: 'بخور ومباخر فاخرة',
    text: 'بخور عود معمول ومباخر خشبية أنيقة تملأ بيتك ومجلسك برائحة الضيافة العربية الأصيلة.',
  },
  {
    icon: 'fa-hand-holding-dollar',
    title: 'الدفع عند الاستلام + هدية',
    text: 'افحص عطرك قبل الدفع، وكل طلب شراء يمنحك رقم سحب في سحب الباشا الذهبي على طقم عطور فاخر.',
  },
];

export default function WhyUs() {
  return (
    <section id="why-pasha" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Reveal className="relative overflow-hidden rounded-2xl border border-gold-400/15 bg-gradient-to-br from-pasha-950 via-pasha-900 to-pasha-950 p-6 text-white shadow-xl sm:p-10">
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-72 w-72 rounded-full bg-gold-400/10 blur-2xl" />
        <div className="pointer-events-none absolute -right-10 -top-20 h-64 w-64 rounded-full bg-gold-400/10 blur-2xl" />

        <div className="relative mx-auto mb-8 max-w-2xl text-center">
          <span className="rounded-full border border-gold-300/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-gold-300">
            الباشا للعطور
          </span>
          <h2 className="mt-2 display text-3xl text-white sm:text-4xl">
            لماذا يختار العملاء متجر الباشا؟
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-pasha-100/80 sm:text-sm">
            تشكيلة واحدة تجمع العطور الشرقية والفرنسية مع العود والبخور — بأسعار واضحة،
            ودفع عند الاستلام، وهدية مع كل طلب.
          </p>
        </div>

        <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, index) => (
            <Reveal
              key={feature.title}
              delay={index * 90}
              className="rounded-xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-sm transition hover:-translate-y-1 hover:border-gold-300/40 hover:bg-white/10"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-gold-300/30 bg-gold-400/10 text-xl text-gold-300">
                <i className={`fa-solid ${feature.icon}`} />
              </div>
              <h3 className="mb-1.5 font-messiri text-base font-bold">{feature.title}</h3>
              <p className="text-xs leading-relaxed text-pasha-100/80">{feature.text}</p>
            </Reveal>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
