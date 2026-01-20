"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { format, isValid } from "date-fns";
import { id } from "date-fns/locale";
import { DailySale } from "@/types/api";

interface SalesChartProps {
  data: DailySale[];
}

export function SalesChart({ data }: SalesChartProps) {
  return (
    <div className="w-full h-72 md:h-80 font-sans">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false} 
            stroke="hsl(var(--border))" 
            opacity={0.5} 
          />

          <XAxis
            dataKey="date"
            tickFormatter={(value) => {
              const date = new Date(value);
              return isValid(date) ? format(date, "dd MMM", { locale: id }) : "";
            }}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            dy={10}
            minTickGap={30}
          />

          <YAxis
            tickFormatter={(value) =>
              value >= 1000000
                ? `${(value / 1000000).toFixed(1)}jt`
                : `${(value / 1000).toLocaleString("id-ID")}rb`
            }
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            dx={-5}
          />

          <Tooltip
            cursor={{ stroke: "hsl(var(--primary))", strokeWidth: 1, strokeDasharray: "4 4" }}
            content={({ active, payload, label }) => {
              // Validasi label dan payload
              const date = label ? new Date(label) : null;
              
              if (active && payload && payload.length && date && isValid(date)) {
                return (
                  <div className="bg-card border border-border p-3 rounded-xl shadow-xl">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                      {format(date, "EEEE, dd MMMM yyyy", { locale: id })}
                    </p>
                    <p className="text-sm font-bold text-primary">
                      Omzet: Rp {Number(payload[0].value).toLocaleString("id-ID")}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />

          <Area
            type="monotone"
            dataKey="totalRevenue"
            stroke="hsl(var(--primary))"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorRevenue)"
            activeDot={{
              r: 6,
              fill: "hsl(var(--primary))",
              stroke: "hsl(var(--background))",
              strokeWidth: 2,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}