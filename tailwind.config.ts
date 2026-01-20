// tailwind.config.ts
const config = {
  theme: {
    extend: {
      colors: {
        // Ini menghubungkan class 'bg-primary' ke variabel di globals.css
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        // Anda tetap bisa menyimpan warna kustom CemaraFarm
        farm: {
          cream: "#FDFCF0",
          dark: "#2D3A30",
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    }
  }
}