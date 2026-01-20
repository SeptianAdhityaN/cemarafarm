"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";

export function SessionTimeoutHandler() {
  const { data: session } = useSession();

  useEffect(() => {
    // Jika ada error pada refresh token atau sesi habis, logout otomatis
    if (session?.error === "RefreshAccessTokenError") {
      signOut({ callbackUrl: "/login" });
    }
  }, [session]);

  return null; // Komponen ini tidak merender apa pun ke UI
}