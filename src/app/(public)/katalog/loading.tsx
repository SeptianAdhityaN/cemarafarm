// src/app/(public)/katalog/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingKatalog() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-24">
      {/* Header Skeleton */}
      <div className="text-center space-y-4 mb-12">
        <Skeleton className="h-10 w-64 mx-auto" />
        <Skeleton className="h-4 w-full max-w-md mx-auto" />
      </div>

      {/* Filter Skeleton */}
      <div className="flex flex-col md:flex-row gap-4 mb-10">
        <Skeleton className="h-12 flex-1 rounded-xl" />
        <Skeleton className="h-12 w-full md:w-48 rounded-xl" />
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="rounded-[2rem] border border-border p-4 space-y-4">
            <Skeleton className="aspect-4/3 w-full rounded-2xl" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="flex justify-between items-center pt-4">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-10 w-24 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}