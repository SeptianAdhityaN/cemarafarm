import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function SalesLoading() {
  return (
    <div className="p-4 md:p-6 space-y-6 max-w-full overflow-hidden">
      {/* Header & Controls Area Skeleton */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div className="space-y-2">
          <Skeleton className="h-10 w-64 bg-muted" />
          <Skeleton className="h-4 w-48 bg-muted" />
        </div>

        {/* Action Group Skeleton */}
        <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto">
          <Skeleton className="h-10 w-24 bg-muted rounded-xl" />
          <Skeleton className="h-10 w-32 bg-muted rounded-xl" />
          
          <div className="hidden lg:block h-8 w-px bg-border mx-1" />

          <div className="flex-1 md:w-64">
            <Skeleton className="h-10 w-full bg-muted rounded-xl" />
          </div>
          <Skeleton className="h-10 w-32 bg-muted rounded-xl" />
        </div>
      </div>

      {/* Table Container Skeleton */}
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden w-full">
        <Table>
          {/* Desktop Header Skeleton - Sinkron dengan SalesPage */}
          <TableHeader className="hidden md:table-header-group bg-muted/50">
            <TableRow>
              <TableHead className="w-45"><Skeleton className="h-4 w-20 bg-muted" /></TableHead>
              <TableHead><Skeleton className="h-4 w-32 bg-muted" /></TableHead>
              <TableHead><Skeleton className="h-4 w-28 bg-muted" /></TableHead>
              <TableHead><Skeleton className="h-4 w-12 bg-muted" /></TableHead>
              <TableHead className="text-right"><Skeleton className="h-4 w-20 bg-muted ml-auto" /></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-border">
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index} className="block md:table-row">
                
                {/* --- MOBILE VIEW: Merged Cell Skeleton (Clean & Aligned) --- */}
                <TableCell className="block md:hidden p-4">
                  <div className="flex justify-between gap-4">
                    {/* Left Info: Time, Product, Batch, Customer, Channel */}
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-32 bg-muted" /> {/* Time */}
                      <Skeleton className="h-5 w-40 bg-muted" /> {/* Product Name */}
                      <Skeleton className="h-4 w-20 bg-muted rounded" /> {/* Batch Code */}
                      <Skeleton className="h-4 w-36 bg-muted" /> {/* Customer Name */}
                      <div className="pt-1">
                        <Skeleton className="h-4 w-16 bg-muted rounded-full" /> {/* Channel */}
                      </div>
                    </div>

                    {/* Right Info: Quantity & Total Price */}
                    <div className="text-right shrink-0 flex flex-col justify-between">
                      <Skeleton className="h-4 w-12 bg-muted ml-auto" /> {/* Quantity */}
                      <Skeleton className="h-6 w-28 bg-muted ml-auto" /> {/* Total Price */}
                    </div>
                  </div>
                </TableCell>

                {/* --- DESKTOP VIEW: Individual Cells Skeleton --- */}
                <TableCell className="hidden md:table-cell p-4">
                  <Skeleton className="h-4 w-32 bg-muted" /> {/* Time */}
                </TableCell>

                <TableCell className="hidden md:table-cell p-4 space-y-2">
                  <Skeleton className="h-5 w-40 bg-muted" /> {/* Product */}
                  <Skeleton className="h-3 w-20 bg-muted" /> {/* Batch */}
                </TableCell>

                <TableCell className="hidden md:table-cell p-4 space-y-2">
                  <Skeleton className="h-5 w-36 bg-muted" /> {/* Customer */}
                  <Skeleton className="h-4 w-16 bg-muted rounded-full" /> {/* Channel */}
                </TableCell>

                <TableCell className="hidden md:table-cell p-4">
                  <Skeleton className="h-4 w-12 bg-muted" /> {/* Quantity */}
                </TableCell>

                <TableCell className="hidden md:table-cell p-4 text-right">
                  <Skeleton className="h-5 w-24 bg-muted ml-auto" /> {/* Price */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}