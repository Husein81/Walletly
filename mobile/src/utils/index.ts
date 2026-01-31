import { COLOR_PALETTE } from "@/lib/config";
import { DateRangeType } from "@/store";
import { Expense } from "@/types";
import {
  addDays,
  endOfMonth,
  format,
  isBefore,
  isToday,
  isYesterday,
  startOfMonth,
  subDays,
  subMonths,
} from "date-fns";
import { SvgData } from "react-native-svg-charts";

const formattedBalance = (balance: number, currency = "$") =>
  balance >= 0
    ? `${currency}${Number(balance ?? 0).toFixed(2)}`
    : `-${currency}${Math.abs(balance).toFixed(2)}`;

const getColorByIndex = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % COLOR_PALETTE.length;
  return COLOR_PALETTE[index];
};

function transformExpensesToChartData(
  expenses: Expense[],
  date = new Date(),
): {
  labels: string[];
  datasets: { data: number[] }[];
} {
  const grouped: Record<string, number> = {};

  for (const expense of expenses) {
    const dateKey = format(
      new Date(expense.updatedAt || new Date()),
      "yyyy-MM-dd",
    );
    if (!grouped[dateKey]) grouped[dateKey] = 0;
    grouped[dateKey] += Math.abs(expense.amount);
  }

  const firstDay = startOfMonth(date);
  const lastDay = endOfMonth(date);

  const labels: string[] = [];
  const dataPoints: number[] = [];

  let current = firstDay;
  let dayIndex = 0;

  while (isBefore(current, addDays(lastDay, 1))) {
    const dateKey = format(current, "yyyy-MM-dd");
    const label = dayIndex % 8 === 0 ? format(current, "MMM dd") : "";
    labels.push(label);
    dataPoints.push(grouped[dateKey] || 0);
    current = addDays(current, 1);
    dayIndex++;
  }

  labels.push(format(lastDay, "MMM dd"));
  return {
    labels,
    datasets: [{ data: dataPoints }],
  };
}

// First, group and normalize expense amounts by category
function getCategoryChartData(expenses: Expense[]) {
  const categoryMap: Record<string, number> = {};

  for (const exp of expenses) {
    if (!exp.category?.name) continue;

    if (!categoryMap[exp.category.name]) {
      categoryMap[exp.category.name] = 0;
    }
    categoryMap[exp.category.name] += Math.abs(exp.amount);
  }

  const labels = Object.keys(categoryMap);
  const rawData = labels.map((label) => categoryMap[label]);

  const max = Math.max(...rawData, 1); // prevent divide by 0
  const data = rawData.map((value) => value / max); // normalize between 0–1

  return { labels, data };
}

function groupExpensesByCategory(expenses: Expense[]) {
  const map: Record<
    string,
    { name: string; amount: number; category: Expense["category"] }
  > = {};

  for (const expense of expenses) {
    if (!expense.category?.id || typeof expense.amount !== "number") continue;

    const catId = expense.category.id;
    if (!map[catId]) {
      map[catId] = {
        name: expense.category.name,
        amount: 0,
        category: expense.category,
      };
    }

    map[catId].amount += Math.abs(expense.amount);
  }

  return Object.entries(map).map(([id, { name, amount, category }]) => ({
    id,
    name,
    amount,
    category,
  }));
}

function getGroupedBarChartData(expenses: Expense[]): {
  data: SvgData[][];
  labels: string[];
} {
  const accountNames = [
    ...new Set(expenses.map((exp) => exp.fromAccount?.name || "Unknown")),
  ];

  const incomeByAccount: Record<string, number> = {};
  const expenseByAccount: Record<string, number> = {};

  accountNames.forEach((name) => {
    incomeByAccount[name] = 0;
    expenseByAccount[name] = 0;
  });

  expenses.map((exp) => {
    const name = exp.fromAccount?.name || "Unknown";
    const amount = Math.abs(exp.amount);

    if (exp.type === "INCOME") {
      incomeByAccount[name] += amount;
    } else if (exp.type === "EXPENSE") {
      expenseByAccount[name] += amount;
    }
  });

  const data: SvgData[][] = [];
  const labels: string[] = [];

  accountNames.map((name) => {
    labels.push(name);
    data.push([
      {
        value: incomeByAccount[name],
        svg: { fill: "#4ade80" }, // green
        label: "Income",
      },
      {
        value: expenseByAccount[name],
        svg: { fill: "#f87171" }, // red
        label: "Expense",
      },
    ]);
  });

  return {
    data,
    labels,
  };
}
const formatSmartDateTime = (date: Date) => {
  if (isToday(date)) {
    return `Today, ${format(date, "hh:mm a")}`;
  }

  if (isYesterday(date)) {
    return `Yesterday, ${format(date, "hh:mm a")}`;
  }

  return format(date, "dd MMM, hh:mm a");
};

export const getGreeting = (): { greeting: string; icon: string } => {
  const hour = new Date().getHours();
  if (hour < 12) return { greeting: "Good Morning", icon: "Sun" };
  if (hour < 18) return { greeting: "Good Afternoon", icon: "Sun" };
  return { greeting: "Good Evening", icon: "Moon" };
};

export const getDateRangeLabel = (
  range: DateRangeType,
  startDate?: Date,
  endDate?: Date,
) => {
  const today = new Date();

  if (range === "today") {
    return "Today";
  }

  if (range === "week") {
    const start = subDays(today, 7);
    return `${format(start, "dd MMM")} – ${format(today, "dd MMM")}`;
  }

  if (range === "month") {
    const start = subMonths(today, 1);
    return `${format(start, "dd MMM")} – ${format(today, "dd MMM")}`;
  }

  if (range === "custom") {
    return `${format(String(startDate), "dd MMM")} – ${format(String(endDate), "dd MMM")}`;
  }

  return "";
};

export {
  formattedBalance,
  formatSmartDateTime,
  getColorByIndex,
  transformExpensesToChartData,
  getCategoryChartData,
  groupExpensesByCategory,
  getGroupedBarChartData,
};
