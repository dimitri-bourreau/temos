"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { formatDuration } from "@/lib/date-utils";
import { motion } from "framer-motion";

interface DailyAgendaProps {
  data: { date: string; minutes: number }[];
}

export function DailyAgenda({ data }: DailyAgendaProps) {
  const t = useTranslations("statistics");

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
    >
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{t("agenda")}</CardTitle>
        </CardHeader>
        <CardContent>
          {data.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No data
            </p>
          ) : (
            <div className="space-y-1">
              {data.map((day) => (
                <div
                  key={day.date}
                  className="flex items-center justify-between rounded-md px-3 py-2 hover:bg-muted/50"
                >
                  <span className="text-sm">{day.date}</span>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{
                        width: `${Math.min((day.minutes / 480) * 100, 100)}px`,
                      }}
                    />
                    <span className="text-sm font-medium tabular-nums w-14 text-right">
                      {formatDuration(day.minutes)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
