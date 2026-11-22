export default function Stars({ rating = 5, className = 'text-xs' }) {
  return (
    <span className={`inline-flex items-center gap-0.5 text-amber-400 ${className}`} aria-label={`التقييم ${rating} من 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <i
          key={n}
          className={`${n <= Math.round(rating) ? 'fa-solid' : 'fa-regular'} fa-star`}
        />
      ))}
    </span>
  );
}
