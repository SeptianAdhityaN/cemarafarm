import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function UserManagementLoading() {
  return (
    <div className="p-4 md:p-6 space-y-6 max-w-full overflow-x-hidden">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
          <Skeleton className="h-10 w-48 bg-muted" />
          <Skeleton className="h-4 w-64 bg-muted" />
        </div>
        <div className="w-full md:w-72">
          <Skeleton className="h-10 w-full bg-muted rounded-xl" />
        </div>
      </div>

      {/* Table Skeleton Container */}
      <div className="bg-card rounded-2xl border border-border shadow-sm w-full overflow-hidden">
        <Table>
          {/* Desktop Header Skeleton */}
          <TableHeader className="bg-muted/50 hidden md:table-header-group">
            <TableRow>
              <TableHead><Skeleton className="h-4 w-12 bg-muted" /></TableHead>
              <TableHead><Skeleton className="h-4 w-12 bg-muted" /></TableHead>
              <TableHead><Skeleton className="h-4 w-12 bg-muted" /></TableHead>
              <TableHead className="text-right"><Skeleton className="h-4 w-12 bg-muted ml-auto" /></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-border">
            {Array.from({ length: 6 }).map((_, index) => (
              <TableRow key={index} className="block md:table-row">
                
                {/* --- MOBILE VIEW SKELETON: No inner card --- */}
                <TableCell className="block md:hidden p-4">
                  <div className="flex justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                      {/* Avatar Skeleton */}
                      <Skeleton className="w-10 h-10 rounded-full bg-muted shrink-0" />
                      
                      <div className="space-y-2">
                        {/* Name & Email Skeleton */}
                        <Skeleton className="h-5 w-32 bg-muted" />
                        <Skeleton className="h-3 w-40 bg-muted" />
                        {/* Role Badge Skeleton */}
                        <Skeleton className="h-4 w-16 bg-muted rounded-full" />
                      </div>
                    </div>
                    
                    {/* Role Select Button Skeleton */}
                    <Skeleton className="h-8 w-24 bg-muted rounded-lg shrink-0" />
                  </div>
                </TableCell>

                {/* --- DESKTOP VIEW SKELETON: Individual Cells --- */}
                <TableCell className="hidden md:table-cell p-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-8 h-8 rounded-full bg-muted" />
                    <Skeleton className="h-5 w-24 bg-muted" />
                  </div>
                </TableCell>

                <TableCell className="hidden md:table-cell p-4">
                  <Skeleton className="h-4 w-36 bg-muted" />
                </TableCell>

                <TableCell className="hidden md:table-cell p-4">
                  <Skeleton className="h-6 w-16 bg-muted rounded-lg" />
                </TableCell>

                <TableCell className="hidden md:table-cell p-4 text-right">
                  <Skeleton className="h-8 w-28 bg-muted rounded-lg ml-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}