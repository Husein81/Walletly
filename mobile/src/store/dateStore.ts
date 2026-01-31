import { create } from "zustand";

export type DateRangeType = "today" | "week" | "month" | "year" | "custom";

interface DateStore {
  selectedDate: Date;
  dateRangeType: DateRangeType;
  setSelectedDate: (date: Date) => void;
  setDateRangeType: (rangeType: DateRangeType) => void;
}
export const useDateStore = create<DateStore>((set) => ({
  selectedDate: new Date(),
  dateRangeType: "month",
  setSelectedDate: (date) => set({ selectedDate: date }),
  setDateRangeType: (rangeType) => set({ dateRangeType: rangeType }),
}));
