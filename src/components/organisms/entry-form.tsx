"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ColorSwatch } from "@/components/atoms/color-swatch";
import { useCategoriesStore } from "@/features/categories/store";
import { useEntriesStore } from "@/features/entries/store";
import { useTranslations } from "next-intl";
import type { TimeEntry } from "@/types";
import { format, parseISO } from "date-fns";

interface EntryFormProps {
  entry?: TimeEntry | null;
}

export function EntryForm({ entry }: EntryFormProps) {
  const t = useTranslations("entries");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const categories = useCategoriesStore((s) => s.categories);
  const addEntry = useEntriesStore((s) => s.add);
  const updateEntry = useEntriesStore((s) => s.update);

  const now = new Date();
  const defaultDate = format(now, "yyyy-MM-dd");
  const defaultStart = format(now, "HH:mm");
  const defaultEnd = format(new Date(now.getTime() + 60 * 60 * 1000), "HH:mm");

  const [categoryId, setCategoryId] = useState(entry?.categoryId || categories[0]?.id || "");
  const [description, setDescription] = useState(entry?.description || "");
  const [date, setDate] = useState(
    entry ? format(parseISO(entry.startTime), "yyyy-MM-dd") : defaultDate
  );
  const [startTime, setStartTime] = useState(
    entry ? format(parseISO(entry.startTime), "HH:mm") : defaultStart
  );
  const [endTime, setEndTime] = useState(
    entry ? format(parseISO(entry.endTime), "HH:mm") : defaultEnd
  );

  useEffect(() => {
    if (!categoryId && categories.length > 0) {
      setCategoryId(categories[0].id);
    }
  }, [categories, categoryId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const startISO = new Date(`${date}T${startTime}`).toISOString();
    const endISO = new Date(`${date}T${endTime}`).toISOString();

    if (entry) {
      await updateEntry(entry.id, {
        categoryId,
        description,
        startTime: startISO,
        endTime: endISO,
      });
    } else {
      await addEntry({
        categoryId,
        description,
        startTime: startISO,
        endTime: endISO,
      });
    }
    router.push("/entries");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{entry ? t("edit") : t("new")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>{t("category")}</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger>
                <SelectValue />
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
          </div>
          <div className="space-y-2">
            <Label>{t("description")}</Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("descriptionPlaceholder")}
            />
          </div>
          <div className="space-y-2">
            <Label>{t("date")}</Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("startTime")}</Label>
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("endTime")}</Label>
              <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="submit">{tCommon("save")}</Button>
            <Button type="button" variant="outline" onClick={() => router.push("/entries")}>
              {tCommon("cancel")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
