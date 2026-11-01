export function Skeleton({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`animate-pulse rounded-2xl bg-brand-soft ${className}`} />;
}

/** Заглушка для сетки карточек, пока данные загружаются. */
export function CardGridSkeleton({ count = 3, className = "h-56" }: { count?: number; className?: string }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, i) => (
        <Skeleton key={i} className={className} />
      ))}
    </div>
  );
}
