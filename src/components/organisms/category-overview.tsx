"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Settings } from "lucide-react";
import { ColorSwatch } from "@/components/atoms/color-swatch";
import { ConfirmDialog } from "@/components/molecules/confirm-dialog";
import { CategoryForm } from "@/components/organisms/category-form";
import { useCategoriesStore } from "@/features/categories/store";
import { useEntriesStore } from "@/features/entries/store";
import { useTranslations } from "next-intl";
import { EmptyState } from "@/components/atoms/empty-state";
import type { Category } from "@/types";
import * as LucideIcons from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

function getIcon(name: string) {
  const pascalCase = name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (LucideIcons as any)[pascalCase] as
    | React.ComponentType<{ className?: string; style?: React.CSSProperties }>
    | undefined;
}

export function CategoryOverview() {
  const t = useTranslations("categories");
  const tCommon = useTranslations("common");
  const categories = useCategoriesStore((s) => s.categories);
  const addCategory = useCategoriesStore((s) => s.add);
  const updateCategory = useCategoriesStore((s) => s.update);
  const removeCategory = useCategoriesStore((s) => s.remove);
  const entries = useEntriesStore((s) => s.entries);

  const [formOpen, setFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormOpen(true);
  };

  const handleSubmit = async (data: {
    name: string;
    color: string;
    icon: string;
  }) => {
    if (editingCategory) {
      await updateCategory(editingCategory.id, data);
    } else {
      await addCategory(data);
    }
    setEditingCategory(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base">{t("title")}</CardTitle>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setEditingCategory(null);
                setFormOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/settings">
                <Settings className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <EmptyState message={t("noCategories")} />
          ) : (
            <div className="grid gap-2 sm:grid-cols-2">
              {categories.map((cat) => {
                const Icon = getIcon(cat.icon);
                const count = entries.filter(
                  (e) => e.categoryId === cat.id
                ).length;

                return (
                  <div
                    key={cat.id}
                    className="group flex items-center justify-between rounded-lg border border-border p-2.5 transition-all duration-200 hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-md"
                        style={{ backgroundColor: cat.color + "30" }}
                      >
                        {Icon && (
                          <Icon
                            className="h-4 w-4"
                            style={{ color: cat.color }}
                          />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{cat.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {count} {count === 1 ? "entry" : "entries"}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleEdit(cat)}
                      >
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive"
                        onClick={() => setDeleteTarget(cat.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <CategoryForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditingCategory(null);
        }}
        onSubmit={handleSubmit}
        category={editingCategory}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={() => setDeleteTarget(null)}
        title={tCommon("delete")}
        description={t("deleteConfirm")}
        onConfirm={() => {
          if (deleteTarget) removeCategory(deleteTarget);
        }}
      />
    </motion.div>
  );
}
