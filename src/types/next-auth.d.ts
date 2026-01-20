// src/types/next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth";
import { JWT as NextAuthJWT } from "next-auth/jwt"; // Impor tetap dipertahankan

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
    role: string;
  }

  interface Session {
    error?: "RefreshAccessTokenError"; // Untuk menangkap error timeout
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    expiresAt?: number; // Tambahkan ini untuk logika timeout
    error?: "RefreshAccessTokenError"; // Tambahkan ini untuk logika timeout
  }
}