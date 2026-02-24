import { create } from "zustand";

export type DateRangeType = "today" | "week" | "month" | "year" | "custom";

interface DateStore {
  selectedDate: Date;
  dateRangeType: DateRangeType;
  customStartDate?: Date;
  customEndDate?: Date;
  setSelectedDate: (date: Date) => void;
  setDateRangeType: (rangeType: DateRangeType) => void;
  setCustomDateRange: (startDate?: Date, endDate?: Date) => void;
}
export const useDateStore = create<DateStore>((set) => ({
  selectedDate: new Date(),
  dateRangeType: "today",
  customStartDate: undefined,
  customEndDate: undefined,
  setSelectedDate: (date) => set({ selectedDate: date }),
  setDateRangeType: (rangeType) => set({ dateRangeType: rangeType }),
  setCustomDateRange: (startDate, endDate) =>
    set({ customStartDate: startDate, customEndDate: endDate }),
}));
