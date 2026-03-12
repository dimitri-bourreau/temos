"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Square, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTimer } from "@/features/timer/hook";
import { TimerTaskPickerDialog } from "@/components/organisms/timer-task-picker-dialog";
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
  const { isRunning, elapsed, start, stop } = useTimer();
  const [pickerOpen, setPickerOpen] = useState(false);

  const handleSelect = async (categoryId: string, taskId: string) => {
    await start(categoryId, taskId);
  };

  return (
    <>
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
              <div className="flex items-center gap-2">
                {isRunning ? (
                  <Button
                    onClick={() => stop()}
                    variant="destructive"
                    className="w-full active:scale-95 transition-transform"
                  >
                    <Square className="mr-2 h-4 w-4" />
                    {t("stopTimer")}
                  </Button>
                ) : (
                  <Button
                    onClick={() => setPickerOpen(true)}
                    variant="outline"
                    className="flex-1 justify-between"
                  >
                    {t("selectTask")}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <TimerTaskPickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onSelect={handleSelect}
      />
    </>
  );
}
