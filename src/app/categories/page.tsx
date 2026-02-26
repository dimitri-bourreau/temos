"use client";

import { useState } from "react";
import { AppShell } from "@/components/templates/app-shell";
import { CategoryList } from "@/components/organisms/category-list";
import { CategoryForm } from "@/components/organisms/category-form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCategoriesStore } from "@/features/categories/store";
import type { Category } from "@/types";

export default function CategoriesPage() {
  const t = useTranslations("categories");
  const [formOpen, setFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const addCategory = useCategoriesStore((s) => s.add);
  const updateCategory = useCategoriesStore((s) => s.update);

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormOpen(true);
  };

  const handleSubmit = async (data: { name: string; color: string; icon: string }) => {
    if (editingCategory) {
      await updateCategory(editingCategory.id, data);
    } else {
      await addCategory(data);
    }
    setEditingCategory(null);
  };

  return (
    <AppShell>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <Button
            onClick={() => {
              setEditingCategory(null);
              setFormOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            {t("new")}
          </Button>
        </div>
        <CategoryList onEdit={handleEdit} />
        <CategoryForm
          open={formOpen}
          onOpenChange={(open) => {
            setFormOpen(open);
            if (!open) setEditingCategory(null);
          }}
          onSubmit={handleSubmit}
          category={editingCategory}
        />
      </div>
    </AppShell>
  );
}
