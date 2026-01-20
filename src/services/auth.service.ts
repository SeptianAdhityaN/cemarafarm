import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const AuthService = {
  async validateUser(email: string, pass: string) {
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      
      if (!user || !user.password) return null;

      const isValid = await bcrypt.compare(pass, user.password);
      if (!isValid) return null;

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      };
    } catch (error) {
      console.error("Auth Error:", error);
      return null;
    }
  }
};