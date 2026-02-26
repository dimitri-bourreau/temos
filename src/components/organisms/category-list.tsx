"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowDown, ArrowUp, ArrowUpDown, Pencil, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/molecules/confirm-dialog";
import { useCategoriesStore } from "@/features/categories/store";
import { useEntriesStore } from "@/features/entries/store";
import { useTranslations } from "next-intl";
import type { Category } from "@/types";
import * as LucideIcons from "lucide-react";

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

type SortKey = "name" | "entries";
type SortDir = "asc" | "desc";

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
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const entryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const entry of entries) {
      if (entry.categoryId) {
        counts[entry.categoryId] = (counts[entry.categoryId] || 0) + 1;
      }
    }
    return counts;
  }, [entries]);

  const sorted = useMemo(() => {
    const list = [...categories];
    list.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") {
        cmp = a.name.localeCompare(b.name);
      } else {
        cmp = (entryCounts[a.id] || 0) - (entryCounts[b.id] || 0);
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [categories, sortKey, sortDir, entryCounts]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) return <ArrowUpDown className="ml-1 h-3 w-3" />;
    return sortDir === "asc" ? (
      <ArrowUp className="ml-1 h-3 w-3" />
    ) : (
      <ArrowDown className="ml-1 h-3 w-3" />
    );
  };

  if (categories.length === 0) {
    return <p className="text-sm text-muted-foreground">{t("noCategories")}</p>;
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">{t("color")}</TableHead>
            <TableHead>
              <button
                className="inline-flex items-center hover:text-foreground"
                onClick={() => toggleSort("name")}
              >
                {t("name")}
                <SortIcon column="name" />
              </button>
            </TableHead>
            <TableHead className="text-right">
              <button
                className="inline-flex items-center hover:text-foreground"
                onClick={() => toggleSort("entries")}
              >
                {t("entries")}
                <SortIcon column="entries" />
              </button>
            </TableHead>
            <TableHead className="w-20" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((cat) => {
            const Icon = getIcon(cat.icon);
            const count = entryCounts[cat.id] || 0;

            return (
              <TableRow key={cat.id}>
                <TableCell>
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
                </TableCell>
                <TableCell className="font-medium">{cat.name}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {count}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => onEdit(cat)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive"
                      onClick={() => setDeleteTarget(cat.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

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
