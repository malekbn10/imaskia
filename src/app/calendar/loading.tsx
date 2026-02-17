import Skeleton from "@/components/ui/Skeleton";

export default function CalendarLoading() {
  return (
    <div className="space-y-4 animate-fade-in">
      {/* Title skeleton */}
      <Skeleton className="h-7 w-48" />

      {/* Table header */}
      <div className="glass-card overflow-hidden">
        <Skeleton className="h-10 w-full rounded-none" />
        {/* Table rows */}
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-none border-t border-gold-dim/20" />
        ))}
      </div>
    </div>
  );
}
