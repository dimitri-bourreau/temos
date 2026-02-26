import { useState, useCallback } from "react";
import { addMonths, subMonths, format } from "date-fns";

export function useCalendarNavigation() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const goToPrevious = useCallback(() => {
    setCurrentDate((d) => subMonths(d, 1));
  }, []);

  const goToNext = useCallback(() => {
    setCurrentDate((d) => addMonths(d, 1));
  }, []);

  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  const label = format(currentDate, "MMMM yyyy");

  return { currentDate, label, goToPrevious, goToNext, goToToday };
}
