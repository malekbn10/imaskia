import Skeleton from "@/components/ui/Skeleton";

export default function AdhkarLoading() {
  return (
    <div className="space-y-4 animate-fade-in">
      {/* Title skeleton */}
      <Skeleton className="h-7 w-40" />

      {/* Category tabs skeleton */}
      <div className="flex gap-2 overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-20 shrink-0 rounded-full" />
        ))}
      </div>

      {/* Contextual badge */}
      <Skeleton className="h-10 w-full" />

      {/* Dua cards skeleton */}
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-16 w-full" />
      ))}
    </div>
  );
}
