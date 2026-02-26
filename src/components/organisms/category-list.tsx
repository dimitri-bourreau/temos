"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { ColorSwatch } from "@/components/atoms/color-swatch";
import { ConfirmDialog } from "@/components/molecules/confirm-dialog";
import { useCategoriesStore } from "@/features/categories/store";
import { useEntriesStore } from "@/features/entries/store";
import { useTranslations } from "next-intl";
import type { Category } from "@/types";
import * as LucideIcons from "lucide-react";
import { motion } from "framer-motion";

function getIcon(name: string) {
  const pascalCase = name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (LucideIcons as any)[pascalCase] as React.ComponentType<{ className?: string; style?: React.CSSProperties }> | undefined;
}

interface CategoryListProps {
  onEdit: (category: Category) => void;
}

export function CategoryList({ onEdit }: CategoryListProps) {
  const t = useTranslations("categories");
  const tCommon = useTranslations("common");
  const categories = useCategoriesStore((s) => s.categories);
  const removeCategory = useCategoriesStore((s) => s.remove);
  const entries = useEntriesStore((s) => s.entries);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat, i) => {
          const Icon = getIcon(cat.icon);
          const count = entries.filter((e) => e.categoryId === cat.id).length;

          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.05 }}
            >
              <Card className="group">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-lg"
                      style={{ backgroundColor: cat.color + "30" }}
                    >
                      {Icon && <Icon className="h-5 w-5" style={{ color: cat.color }} />}
                    </div>
                    <div>
                      <p className="font-medium">{cat.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {count} {count === 1 ? "entry" : "entries"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onEdit(cat)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => setDeleteTarget(cat.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={() => setDeleteTarget(null)}
        title={tCommon("delete")}
        description={t("deleteConfirm")}
        onConfirm={() => {
          if (deleteTarget) removeCategory(deleteTarget);
        }}
      />
    </>
  );
}
