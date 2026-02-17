import Skeleton from "@/components/ui/Skeleton";

export default function PremiumLoading() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Title skeleton */}
      <Skeleton className="h-7 w-28" />

      {/* Plan cards */}
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-48 w-full" />
      ))}
    </div>
  );
}
