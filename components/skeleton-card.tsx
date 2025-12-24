import { Skeleton } from "./ui/skeleton";

export const SkeletonCard = () => {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-35 w-90 rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-90" />
        <Skeleton className="h-4 w-90" />
        <Skeleton className="h-4 w-90" />
      </div>
    </div>
  );
};