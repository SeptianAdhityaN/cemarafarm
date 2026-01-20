import { Skeleton } from "@/components/ui/skeleton";

export default function ActivityLogLoading() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <Skeleton className="h-8 w-48 bg-muted" />
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Skeleton className="h-10 w-24 bg-muted rounded-lg" />
          <div className="flex-1 md:w-64">
            <Skeleton className="h-10 w-full bg-muted rounded-lg" />
          </div>
        </div>
      </div>

      {/* Logs List */}
      <div className="space-y-4">
        {/* 8 Skeleton Log Entries */}
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="bg-card p-4 rounded-xl border border-border shadow-sm flex items-start gap-4"
          >
            {/* User Icon */}
            <div className="bg-muted p-2 rounded-full mt-1">
              <Skeleton className="h-4 w-4 bg-muted" />
            </div>
            
            {/* Log Content */}
            <div className="flex-1 space-y-3">
              {/* User Info & Timestamp */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-28 bg-muted" />
                  <Skeleton className="h-3 w-20 bg-muted" />
                </div>
                <Skeleton className="h-6 w-32 bg-muted rounded-md" />
              </div>
              
              {/* Action & Details */}
              <div className="flex items-start gap-2">
                <Skeleton className="h-5 w-16 bg-muted rounded-full mt-0.5" />
                <Skeleton className="h-4 w-full bg-muted" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}