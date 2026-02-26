"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: string;
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function StatCard({ label, value, subtitle, icon, className }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={className}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            {icon && <div className="text-muted-foreground">{icon}</div>}
          </div>
          <p className="mt-1 text-2xl font-bold">{value}</p>
          {subtitle && (
            <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
