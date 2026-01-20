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
          text-xs p-2 border border-slate-200 rounded-lg outline-emerald-500 bg-white shadow-sm 
          focus:ring-2 focus:ring-emerald-100 transition-all cursor-pointer
          ${isPending ? "opacity-50 grayscale" : "opacity-100"}
        `}
      >
        <option value="ADMIN">ADMIN</option>
        <option value="STAFF">STAFF</option>
        <option value="USER">USER (No Dashboard)</option>
      </select>
      {isPending && (
        <span className="absolute -right-6 top-1/2 -translate-y-1/2">
          <div className="w-3 h-3 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </span>
      )}
    </div>
  );
}