import { COLOR_PALETTE } from "~/lib/config";
import { addDays, endOfMonth, format, isBefore, startOfMonth } from "date-fns";
import { Expense } from "./types";

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
  date = new Date()
): {
  labels: string[];
  datasets: { data: number[] }[];
} {
  const grouped: Record<string, number> = {};

  for (const expense of expenses) {
    const dateKey = format(
      new Date(expense.updatedAt || new Date()),
      "yyyy-MM-dd"
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
    const label = dayIndex % 8 === 0 ? format(current, "dd/MMM") : "";
    labels.push(label);
    dataPoints.push(grouped[dateKey] || 0);
    current = addDays(current, 1);
    dayIndex++;
  }

  labels.push(format(lastDay, "dd/MMM"));
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

function getGroupedBarChartData(expenses: Expense[]) {
  const accountNames = [
    ...new Set(expenses.map((exp) => exp.fromAccount?.name || "Unknown")),
  ];

  const incomeByAccount: Record<string, number> = {};
  const expenseByAccount: Record<string, number> = {};

  accountNames.forEach((name) => {
    incomeByAccount[name] = 0;
    expenseByAccount[name] = 0;
  });

  expenses.forEach((exp) => {
    const name = exp.fromAccount?.name || "Unknown";
    const amount = Math.abs(exp.amount);

    if (exp.type === "INCOME") {
      incomeByAccount[name] += amount;
    } else if (exp.type === "EXPENSE") {
      expenseByAccount[name] += amount;
    }
  });

  // Flatten bars: [income1, expense1, income2, expense2, ...]
  const labels: string[] = [];
  const data: number[] = [];

  accountNames.forEach((name) => {
    labels.push(`${name}-IN`);
    data.push(incomeByAccount[name]);

    labels.push(`${name}-EX`);
    data.push(expenseByAccount[name]);
  });

  return {
    labels,
    datasets: [{ data }],
  };
}

export {
  formattedBalance,
  getColorByIndex,
  transformExpensesToChartData,
  getCategoryChartData,
  groupExpensesByCategory,
  getGroupedBarChartData,
};
