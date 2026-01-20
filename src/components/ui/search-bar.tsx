"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { useTransition, useState } from "react";

export function SearchBar({ placeholder = "Cari data..." }: { placeholder?: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [isPending, startTransition] = useTransition();
  
  const [query, setQuery] = useState(searchParams.get("query") || "");

  const handleSearch = (term: string) => {
    setQuery(term);
    
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      if (term) {
        params.set("query", term);
      } else {
        params.delete("query");
      }
      replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <div className="relative w-full max-w-sm">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
        <Search size={18} />
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full pl-10 pr-10 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all"
      />
      {query && (
        <button
          onClick={() => handleSearch("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500"
        >
          <X size={16} />
        </button>
      )}
      
      {isPending && (
        <div className="absolute -bottom-1 left-2 right-2 h-0.5 bg-emerald-100 overflow-hidden rounded-full">
          <div className="h-full bg-emerald-500 animate-pulse w-full" />
        </div>
      )}
    </div>
  );
}