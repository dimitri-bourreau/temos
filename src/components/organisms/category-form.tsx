"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ColorPicker } from "@/components/molecules/color-picker";
import { IconPicker } from "@/components/molecules/icon-picker";
import { useTranslations } from "next-intl";
import type { Category } from "@/types";
import { PASTEL_COLORS, CATEGORY_ICONS } from "@/lib/constants";

interface CategoryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { name: string; color: string; icon: string }) => void;
  category?: Category | null;
}

export function CategoryForm({
  open,
  onOpenChange,
  onSubmit,
  category,
}: CategoryFormProps) {
  const t = useTranslations("categories");
  const tCommon = useTranslations("common");
  const [name, setName] = useState("");
  const [color, setColor] = useState(PASTEL_COLORS[0]);
  const [icon, setIcon] = useState(CATEGORY_ICONS[0]);

  useEffect(() => {
    if (category) {
      setName(category.name);
      setColor(category.color);
      setIcon(category.icon);
    } else {
      setName("");
      setColor(PASTEL_COLORS[0]);
      setIcon(CATEGORY_ICONS[0]);
    }
  }, [category, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), color, icon });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {category ? t("edit") : t("new")}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>{t("name")}</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("namePlaceholder")}
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label>{t("color")}</Label>
              <ColorPicker value={color} onChange={setColor} />
            </div>
            <div className="space-y-2">
              <Label>{t("icon")}</Label>
              <IconPicker value={icon} onChange={setIcon} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {tCommon("cancel")}
            </Button>
            <Button type="submit" disabled={!name.trim()}>
              {tCommon("save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
