// src/lib/auth-options.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { AuthService } from "@/services/auth.service";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 1 * 60 * 60, // Sesi 1 Jam
    // maxAge: 30, // Sesi 1 Jam
    updateAge: 24 * 60 * 60, 
  },
  pages: { signIn: "/login" },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        const user = await AuthService.validateUser(credentials.email, credentials.password);
        
        if (!user) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user && account) {
        return {
          ...token,
          id: user.id,
          role: user.role || "STAFF",
          expiresAt: Math.floor(Date.now() / 1000) + (1 * 60 * 60), 
          // expiresAt: Math.floor(Date.now() / 1000) + 30, 
        };
      }

      // Cek apakah token sudah melewati batas waktu
      if (Date.now() < (token.expiresAt as number) * 1000) {
        return token;
      }

      // Jika token sudah expired, tandai dengan error
      return { ...token, error: "RefreshAccessTokenError" };
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.error = token.error as "RefreshAccessTokenError" | undefined;
      }
      return session;
    }
  }
};