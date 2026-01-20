import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ProductionLoading() {
  return (
    <div className="p-4 md:p-6 space-y-6 max-w-full overflow-x-hidden">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
          <Skeleton className="h-10 w-48 bg-muted" />
          <Skeleton className="h-4 w-64 bg-muted" />
        </div>

        {/* Action Buttons Skeleton */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <Skeleton className="h-10 w-24 bg-muted rounded-xl" />
          <Skeleton className="h-10 w-32 bg-muted rounded-xl" />
          <div className="flex-1 md:w-64">
            <Skeleton className="h-10 w-full bg-muted rounded-xl" />
          </div>
          <Skeleton className="h-10 w-36 bg-muted rounded-xl" />
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden w-full">
        <Table>
          {/* Desktop Header Skeleton */}
          <TableHeader className="hidden md:table-header-group bg-muted/50">
            <TableRow>
              <TableHead className="w-50"><Skeleton className="h-4 w-24 bg-muted" /></TableHead>
              <TableHead><Skeleton className="h-4 w-20 bg-muted" /></TableHead>
              <TableHead><Skeleton className="h-4 w-28 bg-muted" /></TableHead>
              <TableHead><Skeleton className="h-4 w-16 bg-muted" /></TableHead>
              <TableHead className="text-right"><Skeleton className="h-4 w-16 bg-muted ml-auto" /></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-border">
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index} className="block md:table-row">
                
                {/* --- MOBILE VIEW SKELETON: Clean & Aligned --- */}
                <TableCell className="block md:hidden p-4">
                  <div className="space-y-4">
                    {/* Top Row: Code & Status */}
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-24 bg-muted" />
                        <Skeleton className="h-4 w-32 bg-muted" />
                      </div>
                      <Skeleton className="h-5 w-20 bg-muted rounded-full" />
                    </div>

                    {/* Middle Row: Dates (Left & Right Aligned) */}
                    <div className="flex justify-between items-end border-t border-dashed border-border pt-3">
                      <div className="space-y-2">
                        <Skeleton className="h-3 w-12 bg-muted" />
                        <Skeleton className="h-4 w-24 bg-muted" />
                      </div>
                      <div className="space-y-2 flex flex-col items-end">
                        <Skeleton className="h-3 w-20 bg-muted" />
                        <Skeleton className="h-4 w-24 bg-muted" />
                      </div>
                    </div>

                    {/* Bottom Row: Button Action */}
                    <div className="pt-1">
                      <Skeleton className="h-10 w-full bg-muted rounded-xl" />
                    </div>
                  </div>
                </TableCell>

                {/* --- DESKTOP VIEW SKELETON: Individual Cells --- */}
                <TableCell className="hidden md:table-cell space-y-2">
                  <Skeleton className="h-5 w-24 bg-muted" />
                  <Skeleton className="h-4 w-32 bg-muted" />
                </TableCell>
                
                <TableCell className="hidden md:table-cell">
                  <Skeleton className="h-4 w-24 bg-muted" />
                </TableCell>
                
                <TableCell className="hidden md:table-cell">
                  <Skeleton className="h-4 w-28 bg-muted" />
                </TableCell>
                
                <TableCell className="hidden md:table-cell">
                  <Skeleton className="h-6 w-20 bg-muted rounded-full" />
                </TableCell>
                
                <TableCell className="hidden md:table-cell text-right">
                  <Skeleton className="h-9 w-32 bg-muted rounded-lg ml-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}