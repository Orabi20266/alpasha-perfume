import { ART } from '../../data/art';

export default function ProductArt({ product, className = '' }) {
  if (product?.imageUrl) {
    return (
      <img
        src={product.imageUrl}
        alt={product.name || ''}
        loading="lazy"
        className={`object-contain ${className}`}
      />
    );
  }
  const markup = ART[product?.art] || ART.bottle;
  return (
    <div
      className={`[&>svg]:h-full [&>svg]:w-full ${className}`}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}
