import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: "Data tidak lengkap" }, { status: 400 });
    }

    // Cek apakah user sudah ada
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ message: "Email sudah terdaftar" }, { status: 400 });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan ke DB dengan role USER (Bukan ADMIN/STAFF)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "USER",
      },
    });

    return NextResponse.json({ message: "User berhasil dibuat", user: { email: user.email } }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}