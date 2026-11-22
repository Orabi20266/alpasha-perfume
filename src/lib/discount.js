// خصومات آخر السنة: شرائح تُحسب على مجموع السلة قبل الضريبة.
// تبدأ النسبة من 10% عند 500 وتتناقص مع ارتفاع قيمة الطلب.
// تُطبَّق الشريحة الأعلى التي يصل إليها الطلب، وتُدار من لوحة التحكم.

export const normalizeTiers = (tiers = []) =>
  [...(Array.isArray(tiers) ? tiers : [])]
    .map((tier) => ({
      threshold: Math.max(0, Number(tier?.threshold) || 0),
      percent: Math.min(100, Math.max(0, Number(tier?.percent) || 0)),
    }))
    .filter((tier) => tier.threshold > 0 && tier.percent > 0)
    .sort((a, b) => a.threshold - b.threshold);

export const tierForSubtotal = (subtotal, tiers = []) => {
  const amount = Number(subtotal) || 0;
  return normalizeTiers(tiers).reduce(
    (active, tier) => (amount >= tier.threshold ? tier : active),
    null,
  );
};

export const nextTierForSubtotal = (subtotal, tiers = []) => {
  const amount = Number(subtotal) || 0;
  return (
    normalizeTiers(tiers).find((tier) => amount < tier.threshold) || null
  );
};

export const discountForSubtotal = (subtotal, tiers = []) => {
  const amount = Number(subtotal) || 0;
  const tier = tierForSubtotal(amount, tiers);
  return {
    tier,
    amount: tier ? Math.round((amount * tier.percent) / 100) : 0,
  };
};

export const maxTierPercent = (tiers = []) =>
  normalizeTiers(tiers).reduce((max, tier) => Math.max(max, tier.percent), 0);
