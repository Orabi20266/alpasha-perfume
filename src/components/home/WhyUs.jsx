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
      <Reveal className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pasha-900 via-pasha-800 to-pasha-950 p-6 text-white shadow-xl sm:p-10">
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-72 w-72 rounded-full bg-pasha-500/10 blur-2xl" />
        <div className="pointer-events-none absolute -right-10 -top-20 h-64 w-64 rounded-full bg-gold-400/10 blur-2xl" />

        <div className="relative mx-auto mb-8 max-w-2xl text-center">
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-pasha-300">
            الباشا للعطور
          </span>
          <h2 className="mt-2 text-2xl font-black sm:text-3xl">
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
              className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm transition hover:-translate-y-1 hover:bg-white/15"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-gold-400/40 bg-pasha-500/30 text-xl text-gold-300">
                <i className={`fa-solid ${feature.icon}`} />
              </div>
              <h3 className="mb-1.5 text-base font-extrabold">{feature.title}</h3>
              <p className="text-xs leading-relaxed text-pasha-100/80">{feature.text}</p>
            </Reveal>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
