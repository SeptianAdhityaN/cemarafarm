// src/types/next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Menambahkan properti 'role' ke dalam objek user yang dikembalikan oleh authorize
   */
  interface User extends DefaultUser {
    id: string;
    role: string;
  }

  /**
   * Menambahkan properti 'role' ke dalam objek session.user
   */
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  /**
   * Menambahkan properti 'role' ke dalam token JWT
   */
  interface JWT {
    id: string;
    role: string;
  }
}
