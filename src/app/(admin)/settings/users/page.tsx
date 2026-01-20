import { prisma } from "@/lib/prisma";
import { User as UserIcon, ArrowLeft } from "lucide-react";
import { RoleSelect } from "@/components/settings/role-select";
import { SearchBar } from "@/components/ui/search-bar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";

export default async function UserManagementPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const query = (await searchParams).query;

  const users = await prisma.user.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { email: { contains: query, mode: "insensitive" } },
      ],
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-full overflow-x-hidden">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
         <Link 
          href="/settings" 
          className="mt-1 w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 shadow-sm shrink-0"
          title="Kembali ke Pengaturan"
        >
          <ArrowLeft size={20} />
        </Link>
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
            Manajemen Tim
          </h1>
          <p className="text-muted-foreground text-sm font-sans">
            Kelola akses staff CemaraFarm.
          </p>
        </div>

        <div className="w-full md:w-72">
          <SearchBar placeholder="Cari nama atau email..." />
        </div>
      </div>

      {/* TABLE CONTAINER */}
      <div className="bg-card rounded-2xl border border-border shadow-sm w-full overflow-hidden">
        <Table>
          {/* DESKTOP HEADER */}
          <TableHeader className="bg-muted/50 hidden md:table-header-group">
            <TableRow>
              <TableHead className="font-bold">User</TableHead>
              <TableHead className="font-bold">Email</TableHead>
              <TableHead className="font-bold">Role</TableHead>
              <TableHead className="text-right font-bold">Aksi</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-border">
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="p-10 text-center text-muted-foreground italic font-sans">
                  User tidak ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => {
                const getRoleStyle = () => {
                  switch (user.role) {
                    case "ADMIN":
                      return "bg-purple-50 text-purple-700 border-purple-100";
                    case "STAFF":
                      return "bg-blue-50 text-blue-700 border-blue-100";
                    default:
                      return "bg-muted text-muted-foreground border-border";
                  }
                };

                return (
                  <TableRow
                    key={user.id}
                    className="block md:table-row hover:bg-muted/30 transition-colors"
                  >
                    {/* --- MOBILE VIEW: Merged Cell (No inner card) --- */}
                    <TableCell className="block md:hidden p-4">
                      <div className="flex justify-between items-center gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                            <UserIcon size={20} />
                          </div>
                          <div className="space-y-1">
                            <div className="font-bold text-foreground leading-tight font-sans text-base">
                              {user.name}
                            </div>
                            <div className="text-xs text-muted-foreground font-sans">
                              {user.email}
                            </div>
                            <span
                              className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getRoleStyle()}`}
                            >
                              {user.role}
                            </span>
                          </div>
                        </div>
                        
                        {/* Action on the right side for Mobile */}
                        <div className="shrink-0">
                          <RoleSelect userId={user.id} currentRole={user.role} />
                        </div>
                      </div>
                    </TableCell>

                    {/* --- DESKTOP VIEW: Individual Cells --- */}
                    <TableCell className="hidden md:table-cell p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                          <UserIcon size={16} />
                        </div>
                        <span className="font-bold text-foreground font-sans">
                          {user.name}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground font-sans p-4">
                      {user.email}
                    </TableCell>

                    <TableCell className="hidden md:table-cell p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getRoleStyle()}`}
                      >
                        {user.role}
                      </span>
                    </TableCell>

                    <TableCell className="hidden md:table-cell text-right p-4">
                      <RoleSelect userId={user.id} currentRole={user.role} />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}