import { useState, useCallback } from "react";
import { addMonths, subMonths, format } from "date-fns";
import { useLocale } from "next-intl";
import { getDateFnsLocale } from "@/lib/get-date-fns-locale";

export function useCalendarNavigation() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const dateFnsLocale = getDateFnsLocale(useLocale());

  const goToPrevious = useCallback(() => {
    setCurrentDate((d) => subMonths(d, 1));
  }, []);

  const goToNext = useCallback(() => {
    setCurrentDate((d) => addMonths(d, 1));
  }, []);

  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  const label = format(currentDate, "MMMM yyyy", { locale: dateFnsLocale });

  return { currentDate, label, goToPrevious, goToNext, goToToday };
}
