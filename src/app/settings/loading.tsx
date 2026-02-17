import Skeleton from "@/components/ui/Skeleton";

export default function SettingsLoading() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Title skeleton */}
      <Skeleton className="h-7 w-32" />

      {/* User card */}
      <Skeleton className="h-20 w-full" />

      {/* Theme picker */}
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>

      {/* Settings list */}
      <Skeleton className="h-48 w-full" />
    </div>
  );
}
