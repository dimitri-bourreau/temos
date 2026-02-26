"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Play, Square } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCategoriesStore } from "@/features/categories/store";
import { useTimer } from "@/features/timer/hook";
import { ColorSwatch } from "@/components/atoms/color-swatch";
import { motion } from "framer-motion";

function formatElapsed(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function QuickTimer() {
  const t = useTranslations("dashboard");
  const categories = useCategoriesStore((s) => s.categories);
  const { isRunning, elapsed, categoryId, start, stop } = useTimer();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");

  const handleStart = async () => {
    const catId = selectedCategoryId || categories[0]?.id;
    if (catId) {
      await start(catId);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{t("quickTimer")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            <div
              className={`text-center font-mono text-3xl font-bold tabular-nums ${
                isRunning ? "animate-pulse" : ""
              }`}
            >
              {formatElapsed(elapsed)}
            </div>
            {!isRunning && (
              <Select
                value={selectedCategoryId}
                onValueChange={setSelectedCategoryId}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("selectCategory")} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      <div className="flex items-center gap-2">
                        <ColorSwatch color={cat.color} className="h-3 w-3" />
                        {cat.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Button
              onClick={isRunning ? stop : handleStart}
              variant={isRunning ? "destructive" : "default"}
              className="w-full active:scale-95 transition-transform"
            >
              {isRunning ? (
                <>
                  <Square className="mr-2 h-4 w-4" />
                  {t("stopTimer")}
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  {t("startTimer")}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
