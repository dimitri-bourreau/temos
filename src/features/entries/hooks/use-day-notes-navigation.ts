import { useState, useCallback, useMemo } from "react";
import { addDays, subDays, startOfDay, endOfDay, format } from "date-fns";
import { useLocale } from "next-intl";
import { getDateFnsLocale } from "@/lib/get-date-fns-locale";
import { useEntriesStore } from "@/features/entries/store";
import { formatDayHeader } from "@/lib/date-utils";

export function useDayNotesNavigation() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const locale = useLocale();
  const dateFnsLocale = getDateFnsLocale(locale);
  const entries = useEntriesStore((s) => s.entries);

  const goToPrevious = useCallback(() => {
    setSelectedDate((d) => subDays(d, 1));
  }, []);

  const goToNext = useCallback(() => {
    setSelectedDate((d) => addDays(d, 1));
  }, []);

  const goToToday = useCallback(() => {
    setSelectedDate(new Date());
  }, []);

  const selectDate = useCallback((date: Date) => {
    setSelectedDate(date);
  }, []);

  const label = formatDayHeader(
    format(selectedDate, "yyyy-MM-dd"),
    locale,
  );

  const datesWithEntries = useMemo(() => {
    const dateSet = new Set<string>();
    for (const entry of entries) {
      const dateKey = entry.startTime.slice(0, 10);
      dateSet.add(dateKey);
    }
    return dateSet;
  }, [entries]);

  const dayStart = startOfDay(selectedDate).toISOString();
  const dayEnd = endOfDay(selectedDate).toISOString();

  return {
    selectedDate,
    dayStart,
    dayEnd,
    label,
    goToPrevious,
    goToNext,
    goToToday,
    selectDate,
    datesWithEntries,
    dateFnsLocale,
  };
}
