import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/providers/query-provider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import AuthProvider from "@/components/providers/auth-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  // Title yang baik mengandung Keyword Utama + Nama Brand
  title: {
    default: "CemaraFarm | Sayuran Hidroponik Segar Nganjuk Tanpa Pestisida",
    template: "%s | CemaraFarm"
  },
  description: "CemaraFarm menyediakan sayuran hidroponik premium seperti Selada Romaine dan Pakcoy, dipanen segar setiap hari di Nganjuk. Tanpa pestisida & higienis.",
  keywords: ["hidroponik nganjuk", "sayur segar nganjuk", "selada keriting nganjuk", "green lettuce nganjuk", "kebun hidroponik", "cemarafarm", "sayur tanpa pestisida"],
  authors: [{ name: "CemaraFarm Team" }],
  creator: "CemaraFarm",
  
  verification: {
    google: "0UUzAal14TR3B_M5vpb7YsKQOxEqgxc8fpJZ8Scp2dg",
  },
  // Open Graph (Untuk tampilan saat link dibagikan di WA/FB/IG)
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://cemarafarm.vercel.app", 
    siteName: "CemaraFarm",
    title: "CemaraFarm - Sayuran Hidroponik Segar Tanpa Pestisida",
    description: "Nikmati kesegaran sayuran hidroponik premium langsung dari kebun kami di Nganjuk.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Suasana Kebun CemaraFarm",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "CemaraFarm | Sayuran Hidroponik Nganjuk",
    description: "Dipanen setiap pagi, sampai di meja makan Anda dalam kondisi terbaik.",
    images: ["/og-image.jpg"],
  },

  // Favicon & Icon
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="id" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      {/* PENTING: Gunakan bg-background dan text-foreground 
        agar mengikuti variabel OKLCH di globals.css Anda.
      */}
      <body className="antialiased font-sans bg-background text-foreground transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider session={session}>
            <QueryProvider>
              {children}
              <Toaster />
            </QueryProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}