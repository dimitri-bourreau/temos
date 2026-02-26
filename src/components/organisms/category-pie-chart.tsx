"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCategoriesStore } from "@/features/categories/store";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import type { ID } from "@/types";

interface CategoryPieChartProps {
  data: { categoryId: ID; minutes: number }[];
}

export function CategoryPieChart({ data }: CategoryPieChartProps) {
  const t = useTranslations("statistics");
  const categories = useCategoriesStore((s) => s.categories);

  const chartData = data.map((d) => {
    const cat = categories.find((c) => c.id === d.categoryId);
    return {
      name: cat?.name || "Unknown",
      hours: +(d.minutes / 60).toFixed(1),
      color: cat?.color || "#ccc",
    };
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{t("byCategory")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={4}
                dataKey="hours"
                animationDuration={800}
              >
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}
