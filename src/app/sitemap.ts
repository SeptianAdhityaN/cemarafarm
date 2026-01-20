import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Ganti dengan domain asli Anda setelah deploy ke Vercel
  const baseUrl = "https://cemarafarm.vercel.app";

  // Karena saat ini navigasi utama hanya ke halaman statis, 
  // kita cukup mendaftarkan rute utama yang tersedia.
  const routes = [
    "",           // Beranda
    "/katalog",   // Katalog Sayur
    "/tentang-kami", // Tentang Kami
    "/aktivitas", // Log Aktivitas/Produksi
    "/login",
    "/register",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(), // Menggunakan waktu saat ini
    changeFrequency: 'daily' as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  return routes;
}