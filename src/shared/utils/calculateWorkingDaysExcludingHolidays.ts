import { fetchHolidayDates } from "./fetchHolidayDates";

export async function calculateWorkingDaysExcludingHolidays(start: Date, end: Date, duration: string): Promise<number> {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const year = startDate.getFullYear();
  
    const holidayDates = await fetchHolidayDates(year);
  
    let count = 0;
  
    for (
      let current = new Date(startDate);
      current <= endDate;
      current.setDate(current.getDate() + 1)
    ) {
      const day = current.getDay();
      const dateStr = current.toISOString().split("T")[0];
  
      const isWeekend = day === 0 || day === 6;
      const isHoliday = holidayDates.includes(dateStr);
  
      if (!isWeekend && !isHoliday) {
        count += 1;
      }
    }
  
    if (count === 1 && (duration === "morning" || duration === "afternoon")) {
      return 0.5;
    }
  
    return count;
  }