import Skeleton from "@/components/ui/Skeleton";

export default function HomeLoading() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Countdown circle skeleton */}
      <div className="flex justify-center">
        <Skeleton className="h-48 w-48 rounded-full" />
      </div>

      {/* Fasting card skeleton */}
      <Skeleton className="h-24 w-full" />

      {/* Prayer times header */}
      <Skeleton className="h-4 w-32" />

      {/* Prayer times grid skeleton */}
      <div className="glass-card p-3 space-y-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    </div>
  );
}
