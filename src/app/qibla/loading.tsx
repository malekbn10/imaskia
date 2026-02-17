import Skeleton from "@/components/ui/Skeleton";

export default function QiblaLoading() {
  return (
    <div className="flex flex-col items-center gap-6 animate-fade-in">
      {/* Title skeleton */}
      <Skeleton className="h-7 w-36" />

      {/* Compass skeleton */}
      <Skeleton className="h-64 w-64 rounded-full" />

      {/* Info cards */}
      <div className="w-full space-y-3">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    </div>
  );
}
