"use client";

import { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";
import { ConfirmDialog } from "@/components/molecules/confirm-dialog";
import { useTranslations } from "next-intl";
import { useEntriesStore } from "@/features/entries/store";
import { useCategoriesStore } from "@/features/categories/store";
import { useSettingsStore } from "@/features/settings/store";
import { db } from "@/db";
import { exportData } from "@/features/data-exchange/services/export-data";
import { importData } from "@/features/data-exchange/services/import-data";
import { format } from "date-fns";

export function DataManager() {
  const t = useTranslations("settings");
  const fileInput = useRef<HTMLInputElement>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingData, setPendingData] = useState<unknown>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const loadEntries = useEntriesStore((s) => s.load);
  const loadCategories = useCategoriesStore((s) => s.load);
  const loadSettings = useSettingsStore((s) => s.load);

  const handleExport = async () => {
    const data = await exportData(db);
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `temos-export-${format(new Date(), "yyyy-MM-dd")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        setPendingData(data);
        setConfirmOpen(true);
      } catch {
        setMessage({ type: "error", text: t("importError") });
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleImportConfirm = async () => {
    if (!pendingData) return;
    const success = await importData(db, pendingData);
    if (success) {
      await loadEntries();
      await loadCategories();
      await loadSettings();
      setMessage({ type: "success", text: t("importSuccess") });
    } else {
      setMessage({ type: "error", text: t("importError") });
    }
    setPendingData(null);
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{t("data")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{t("exportDescription")}</p>
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              {t("exportData")}
            </Button>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{t("importDescription")}</p>
            <input
              ref={fileInput}
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleFileSelect}
            />
            <Button variant="outline" onClick={() => fileInput.current?.click()}>
              <Upload className="mr-2 h-4 w-4" />
              {t("importData")}
            </Button>
          </div>
          {message && (
            <p
              className={`text-sm ${
                message.type === "success" ? "text-success" : "text-destructive"
              }`}
            >
              {message.text}
            </p>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={t("importData")}
        description={t("importConfirm")}
        onConfirm={handleImportConfirm}
        variant="default"
      />
    </>
  );
}
