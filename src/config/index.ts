export const config = {
  db: {
    url: process.env.DATABASE_URL,
  },
  auth: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || "Cemara Farm",
    baseUrl: process.env.NEXTAUTH_URL,
  }
};

// Cek jika ada config yang krusial yang kosong
if (!config.db.url) throw new Error("DATABASE_URL is missing in .env");