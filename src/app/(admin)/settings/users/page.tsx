import { prisma } from "@/lib/prisma";
import { User as UserIcon, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
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

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function UserManagementPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; page?: string }>;
}) {
  const params = await searchParams;
  const query = params.query || "";
  const currentPage = Number(params.page) || 1;
  const pageSize = 10; // Jumlah data per halaman

  // 1. Ambil data dengan Pagination & Search
  const [users, totalUsers] = await Promise.all([
    prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
        ],
      },
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
    }),
    prisma.user.count({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
        ],
      },
    }),
  ]);

  const totalPages = Math.ceil(totalUsers / pageSize);

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-full overflow-x-hidden animate-fade-in">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link 
            href="/settings" 
            className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all duration-300 shadow-sm shrink-0"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-emerald-900">
              Manajemen Tim
            </h1>
            <p className="text-muted-foreground text-sm font-sans">
              Total {totalUsers} user terdaftar
            </p>
          </div>
        </div>

        <div className="w-full md:w-72">
          <SearchBar placeholder="Cari nama atau email..." />
        </div>
      </div>

      {/* TABLE CONTAINER */}
      <div className="bg-card rounded-2xl border border-border shadow-sm w-full overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30 hidden md:table-header-group">
            <TableRow>
              <TableHead className="font-bold">User</TableHead>
              <TableHead className="font-bold">Email</TableHead>
              <TableHead className="font-bold text-center">Role</TableHead>
              <TableHead className="text-right font-bold">Atur Hak Akses</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-border">
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="p-20 text-center text-muted-foreground italic font-sans">
                  User tidak ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id} className="block md:table-row hover:bg-muted/10 transition-colors">
                  {/* MOBILE VIEW */}
                  <TableCell className="block md:hidden p-4">
                    <div className="flex justify-between items-center gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                          <UserIcon size={20} />
                        </div>
                        <div className="space-y-1">
                          <div className="font-bold text-slate-800 leading-tight">{user.name}</div>
                          <div className="text-xs text-muted-foreground">{user.email}</div>
                          <RoleBadge role={user.role} />
                        </div>
                      </div>
                      <RoleSelect userId={user.id} currentRole={user.role} />
                    </div>
                  </TableCell>

                  {/* DESKTOP VIEW */}
                  <TableCell className="hidden md:table-cell p-4 font-bold text-slate-800">
                    <div className="flex items-center gap-3">
                       <UserIcon size={16} className="text-emerald-600" />
                       {user.name}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-slate-500 p-4">{user.email}</TableCell>
                  <TableCell className="hidden md:table-cell text-center p-4">
                    <RoleBadge role={user.role} />
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-right p-4">
                    <RoleSelect userId={user.id} currentRole={user.role} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* PAGINATION CONTROLS */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-border flex items-center justify-between bg-muted/20">
            <p className="text-xs text-muted-foreground">
              Halaman {currentPage} dari {totalPages}
            </p>
            <div className="flex gap-2">
              <Link
                href={`?page=${currentPage - 1}${query ? `&query=${query}` : ""}`}
                className={`p-2 rounded-lg border border-border bg-white transition-all ${
                  currentPage <= 1 ? "pointer-events-none opacity-30" : "hover:bg-emerald-50"
                }`}
              >
                <ChevronLeft size={18} />
              </Link>
              <Link
                href={`?page=${currentPage + 1}${query ? `&query=${query}` : ""}`}
                className={`p-2 rounded-lg border border-border bg-white transition-all ${
                  currentPage >= totalPages ? "pointer-events-none opacity-30" : "hover:bg-emerald-50"
                }`}
              >
                <ChevronRight size={18} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Sub-komponen Badge agar kode bersih
function RoleBadge({ role }: { role: string }) {
  const styles: Record<string, string> = {
    ADMIN: "bg-purple-100 text-purple-700 border-purple-200",
    STAFF: "bg-blue-100 text-blue-700 border-blue-200",
    USER: "bg-slate-100 text-slate-600 border-slate-200",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border uppercase tracking-widest ${styles[role] || styles.USER}`}>
      {role}
    </span>
  );
}