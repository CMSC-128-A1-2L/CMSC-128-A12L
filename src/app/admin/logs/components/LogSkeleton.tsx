import { Skeleton } from "@/components/ui/skeleton";

export const LogSkeleton = () => {
  return (
    <>
      {/* Desktop View */}
      <div className="hidden md:flex flex-col space-y-3">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex items-center gap-4 p-4">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-[150px]" />
            <Skeleton className="h-4 w-[200px] flex-1" />
            <Skeleton className="h-4 w-[100px]" />
          </div>
        ))}
      </div>

      {/* Mobile View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg p-4 space-y-3">
            <Skeleton className="h-4 w-[120px]" />
            <Skeleton className="h-4 w-[180px]" />
            <Skeleton className="h-4 w-full" />
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-[80px]" />
              <Skeleton className="h-4 w-[100px]" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
