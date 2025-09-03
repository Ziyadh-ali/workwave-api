import axios from "axios";
import { config } from "../config";

export  async function fetchHolidayDates(year: number): Promise<string[]> {
    try {
      const res = await axios.get(config.calander.CALENDARIFIC_URL!, {
        params: {
          api_key: config.calander.CALENDARIFIC_API_KEY,
          country: "IN",
          year,
        },
      });
  
      const holidays: { date: { iso: string } }[] = res.data.response.holidays;
  
      return holidays.map((holiday) => holiday.date.iso);
    } catch (error) {
      console.error("Error fetching holidays:", error);
      return [];
    }
  }