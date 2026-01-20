"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";

// Definisikan tipe untuk state agar tidak menggunakan 'any'
export interface RegisterState {
  error?: string;
  success?: string;
}

export async function registerAction(
  _prevState: RegisterState | null, // Mengganti any dengan interface
  formData: FormData
): Promise<RegisterState> { // Menentukan return type secara eksplisit
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as Role;

  if (!name || !email || !password) {
    return { error: "Semua field wajib diisi." };
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "Email sudah digunakan oleh tim lain." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "USER",
      },
    });

    revalidatePath("/settings/users");

    return { success: "User berhasil didaftarkan ke tim!" };
  } catch (error) {
    console.error("Register Error:", error);
    return { error: "Terjadi kesalahan sistem saat mendaftarkan user." };
  }
}