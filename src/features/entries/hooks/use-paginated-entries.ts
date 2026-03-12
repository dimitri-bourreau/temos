import { useMemo, useState, useEffect } from "react";
import { parseISO, format } from "date-fns";
import type { TimeEntry } from "@/types";
import { groupEntriesByDay } from "@/features/entries/services/group-entries-by-day";

const DAYS_PER_PAGE = 7;

export function usePaginatedEntries(
  entries: TimeEntry[],
  categoryFilter?: string,
  dateFilter?: string
) {
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    let result = entries;
    if (dateFilter) {
      result = result.filter(
        (e) => format(parseISO(e.startTime), "yyyy-MM-dd") === dateFilter
      );
    }
    if (categoryFilter) {
      result = result.filter((e) => e.categoryId === categoryFilter);
    }
    return result;
  }, [entries, categoryFilter, dateFilter]);

  const allDayGroups = useMemo(() => groupEntriesByDay(filtered), [filtered]);
  const totalPages = Math.max(1, Math.ceil(allDayGroups.length / DAYS_PER_PAGE));

  useEffect(() => {
    setCurrentPage(1);
  }, [categoryFilter, dateFilter]);

  const safePage = Math.min(currentPage, totalPages);

  const paginatedDayGroups = useMemo(() => {
    const start = (safePage - 1) * DAYS_PER_PAGE;
    return allDayGroups.slice(start, start + DAYS_PER_PAGE);
  }, [allDayGroups, safePage]);

  return {
    filtered,
    paginatedDayGroups,
    currentPage: safePage,
    totalPages,
    goToPage: setCurrentPage,
  };
}
