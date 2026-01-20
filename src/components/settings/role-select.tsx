"use client";

import { useTransition } from "react";
import { updateUserRole } from "@/lib/actions/user";
import { Role } from "@prisma/client";

interface RoleSelectProps {
  userId: string;
  currentRole: Role;
}

export function RoleSelect({ userId, currentRole }: RoleSelectProps) {
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as Role;

    // Konfirmasi sederhana agar tidak salah klik
    if (confirm(`Ubah akses user menjadi ${newRole}?`)) {
      startTransition(async () => {
        const result = await updateUserRole(userId, newRole);
        if (result?.error) {
          alert(result.error);
        }
      });
    }
  };

  return (
    <div className="relative inline-block text-left">
      <select
        defaultValue={currentRole}
        disabled={isPending}
        onChange={handleChange}
        className={`
    text-[11px] font-black tracking-wider p-2 border border-slate-200 rounded-xl 
    outline-emerald-500 bg-slate-50 shadow-sm 
    focus:ring-4 focus:ring-emerald-50 transition-all cursor-pointer
    appearance-none pr-8 // Agar lebih custom
    ${isPending ? "opacity-50" : "opacity-100"}
    ${currentRole === "ADMIN" ? "text-purple-700 font-bold" : ""}
    ${currentRole === "STAFF" ? "text-blue-700 font-bold" : ""}
  `}
      >
        <option value="ADMIN">ADMIN</option>
        <option value="STAFF">STAFF</option>
        <option value="USER">USER (No Access)</option>
      </select>
      {isPending && (
        <span className="absolute -right-6 top-1/2 -translate-y-1/2">
          <div className="w-3 h-3 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </span>
      )}
    </div>
  );
}
