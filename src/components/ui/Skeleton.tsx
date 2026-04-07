/** Animated shimmer block — use as placeholder during data loading */
export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-lg bg-surface-container-high ${className}`} />
  );
}

/** A full list-row skeleton matching the standard tab row height */
export function SkeletonRow({ cols }: { cols: string[] }) {
  return (
    <div className="flex items-center gap-4 px-4 py-4 border-b border-surface-container-low last:border-0">
      {cols.map((cls, i) => (
        <Skeleton key={i} className={cls} />
      ))}
    </div>
  );
}
