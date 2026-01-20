// src/app/(public)/katalog/page.tsx
import { prisma } from "@/lib/prisma";
import { CatalogClient } from "@/components/public/catalog-client";

export default async function KatalogPage() {
  const varieties = await prisma.variety.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      category: true,
      imageUrl: true,
      batches: {
        where: {
          isArchived: false,
          status: { in: ["READY_TO_HARVEST", "GROWING"] },
        },
        select: {
          status: true,
          currentStockKg: true,
        },
      },
    },
    orderBy: { name: "asc" },
  });

  const products = varieties.map((v) => {
    const readyStock = v.batches
      .filter((b) => b.status === "READY_TO_HARVEST")
      .reduce((acc, curr) => acc + Number(curr.currentStockKg), 0);

    const isGrowing = v.batches.some((b) => b.status === "GROWING");

    return {
      id: v.id,
      name: v.name,
      description: v.description,
      // MENGAMBIL HARGA DARI DATABASE
      price: `Rp ${Number(v.price).toLocaleString("id-ID")}`,
      unit: "/kg",
      category: v.category || "Sayuran",
      stock: readyStock > 0,
      currentStock: readyStock,
      badge:
        readyStock > 0 ? "Ready Stock" : isGrowing ? "Coming Soon" : "Habis",
      // MENGAMBIL LINK GAMBAR DARI DATABASE
      image: v.imageUrl || "",
    };
  });

  return (
    <div className="pt-20">
      <CatalogClient initialProducts={products} />
    </div>
  );
}
