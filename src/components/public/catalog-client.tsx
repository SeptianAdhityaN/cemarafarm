"use client";

import { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Phone, ShoppingCart, Leaf } from "lucide-react";

// Definisikan tipe data agar lebih aman tanpa 'any'
interface Product {
  id: string;
  name: string;
  description: string | null;
  price: string;
  unit: string;
  category: string;
  stock: boolean;
  currentStock: number;
  badge: string;
  image: string;
}

export function CatalogClient({
  initialProducts,
}: {
  initialProducts: Product[];
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Semua");

  const categories = [
    "Semua",
    ...new Set(initialProducts.map((p) => p.category)),
  ];

  const filtered = initialProducts.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat =
      categoryFilter === "Semua" || p.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const handleWhatsApp = (name: string) => {
    const msg = encodeURIComponent(
      `Halo CemaraFarm, saya ingin memesan ${name}. Apakah stoknya masih tersedia?`,
    );
    window.open(`https://wa.me/6281234567890?text=${msg}`, "_blank");
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      {/* HEADER */}
      <div className="text-center space-y-4 mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
          Katalog Produk
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Pilih sayuran segar hasil panen terbaik kami. Semua ditanam secara
          hidroponik dan dipanen di hari pengiriman.
        </p>
      </div>

      {/* SEARCH & FILTER AREA */}
      <div className="flex flex-col md:flex-row gap-4 mb-10">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Cari sayuran..."
            className="pl-10 rounded-xl bg-card border-border h-12"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full md:w-50 rounded-xl bg-card border-border h-12">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Kategori" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* PRODUCT GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.length > 0 ? (
          filtered.map((product) => (
            <Card
              key={product.id}
              className={`group rounded-[2rem] overflow-hidden border-border transition-all hover:shadow-2xl hover:shadow-primary/10 bg-card ${!product.stock ? "opacity-80" : ""}`}
            >
              {/* IMAGE CONTAINER */}
              <div className="aspect-4/3 bg-muted relative overflow-hidden">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-primary/5">
                    <Leaf className="w-12 h-12 text-primary/20" />
                  </div>
                )}

                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge
                    className={`${product.stock ? "bg-primary" : "bg-muted text-muted-foreground"} rounded-lg shadow-sm`}
                  >
                    {product.badge}
                  </Badge>
                </div>
              </div>

              <CardHeader className="pb-4">
                <div className="flex justify-between items-start gap-2">
                  <div className="min-w-0">
                    <CardTitle className="text-xl font-serif truncate">
                      {product.name}
                    </CardTitle>
                    <p className="text-[10px] text-primary font-bold uppercase tracking-widest mt-1">
                      {product.category}
                    </p>
                  </div>
                  {product.stock && (
                    <div className="text-right shrink-0">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold">
                        Stok Ready
                      </p>
                      <p className="text-sm font-bold text-foreground">
                        {product.currentStock} kg
                      </p>
                    </div>
                  )}
                </div>
                <CardDescription className="line-clamp-2 mt-2 h-10 italic">
                  {product.description ||
                    "Selada hidroponik segar, dipanen langsung dari CemaraFarm."}
                </CardDescription>
              </CardHeader>

              <CardFooter className="flex justify-between items-center border-t border-border/50 pt-6">
                <div>
                  <span className="text-2xl font-bold text-foreground">
                    {product.price}
                  </span>
                  <span className="text-muted-foreground text-sm font-sans ml-1">
                    {product.unit}
                  </span>
                </div>
                <Button
                  onClick={() => handleWhatsApp(product.name)}
                  disabled={!product.stock}
                  className="rounded-xl px-6 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95"
                >
                  <Phone className="w-4 h-4 mr-2" /> Pesan
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-20 text-center space-y-4">
            <div className="inline-flex w-16 h-16 rounded-full bg-muted items-center justify-center">
              <ShoppingCart className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold">Sayuran tidak ditemukan</h3>
            <p className="text-muted-foreground">
              Coba cari varietas lain atau reset kategori.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
