import { Platform, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

// local imports
import { LineChart } from "@/components/Analysis";
import { Overview } from "@/components/Analysis/";
import { Text } from "@/components/ui";
import { ToggleGroup } from "@/components/ui-components";
import DateFilter from "@/components/ui-components/DateFilter";
import { Header } from "@/components/ui-components/Header";
import { useGetExpenses } from "@/hooks/expense";
import {
  formattedBalance,
  getCategoryChartData,
  getColorByIndex,
  groupExpensesByCategory,
  transformExpensesToChartData,
} from "@/utils";
import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "date-fns";
import { useMemo, useState } from "react";

//store imports
import AccountAnalysis from "@/components/Analysis/AccountAnalysis";
import { useGetAccounts } from "@/hooks/accounts";
import { useThemeStore } from "@/store/themStore";
import { useAuthStore, useDateStore } from "@/store";
import { EXPENSE_STATES, ExpenseState } from "@/components/Analysis/config";
import { ToggleOption } from "@/components/ui-components/toggle-group";

const Analysis = () => {
  const { user } = useAuthStore();
  const { isDark } = useThemeStore();

  const [selectedOption, setSelectedOption] = useState<ToggleOption>(
    EXPENSE_STATES[0],
  );
  const { selectedDate, customStartDate, customEndDate, dateRangeType } =
    useDateStore();

  // Calculate date parameters based on selected range type
  const getDateParams = () => {
    switch (dateRangeType) {
      case "today": {
        const start = startOfDay(selectedDate);
        const end = endOfDay(selectedDate);
        return {
          startDate: start,
          endDate: end,
        };
      }
      case "week": {
        const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
        const end = endOfWeek(selectedDate, { weekStartsOn: 1 });
        return {
          startDate: start,
          endDate: end,
        };
      }
      case "month": {
        const start = startOfMonth(selectedDate);
        const end = endOfMonth(selectedDate);
        return {
          startDate: start,
          endDate: end,
        };
      }
      case "year": {
        const start = startOfYear(selectedDate);
        const end = endOfYear(selectedDate);
        return {
          startDate: start,
          endDate: end,
        };
      }
      case "custom": {
        if (customStartDate && customEndDate) {
          return {
            startDate: customStartDate,
            endDate: customEndDate,
          };
        }
        // Fallback to month if custom dates are not set
        const start = startOfMonth(selectedDate);
        const end = endOfMonth(selectedDate);
        return {
          startDate: start,
          endDate: end,
        };
      }
      default:
        return {
          year: selectedDate.getFullYear().toString(),
          month: (selectedDate.getMonth() + 1).toString(),
        };
    }
  };

  // Calculate date parameters based on selected range type
  const dateParams = getDateParams();

  const { data: expenses } = useGetExpenses(user?.id || "", dateParams);
  const { data: accounts } = useGetAccounts(user?.id || "");

  // Expense type data
  const expenseData = useMemo(() => {
    return expenses
      ?.filter((exp) => exp.type === "EXPENSE")
      .map((expense) => ({
        ...expense,
        updatedAt: new Date(expense.updatedAt || new Date()),
      }));
  }, [expenses]);

  // Income type data
  const incomeData = useMemo(() => {
    return expenses
      ?.filter((exp) => exp.type === "INCOME")
      .map((income) => ({
        ...income,
        updatedAt: new Date(income.updatedAt || new Date()),
      }));
  }, [expenses]);

  // Generate line chart data based on selected option
  const expenseLineChartData = useMemo(() => {
    return transformExpensesToChartData(expenseData || [], selectedDate);
  }, [expenseData, selectedDate]);

  const incomeLineChartData = useMemo(() => {
    return transformExpensesToChartData(incomeData || [], selectedDate);
  }, [incomeData, selectedDate]);

  const lineChartData = useMemo(() => {
    if (selectedOption?.value === ExpenseState.ExpenseFlow) {
      return expenseLineChartData;
    } else if (selectedOption?.value === ExpenseState.IncomeFlow) {
      return incomeLineChartData;
    }
    return { labels: [], datasets: [{ data: [] }] };
  }, [selectedOption, expenseLineChartData, incomeLineChartData]);

  // Generate chart data based on selected option
  const expenseChartData = useMemo(() => {
    return getCategoryChartData(expenseData || []);
  }, [expenseData]);

  const incomeChartData = useMemo(() => {
    return getCategoryChartData(incomeData || []);
  }, [incomeData]);

  const chartData = useMemo(() => {
    if (selectedOption?.value === ExpenseState.ExpenseOverview) {
      return expenseChartData;
    } else if (selectedOption?.value === ExpenseState.IncomeOverview) {
      return incomeChartData;
    }
    return { labels: [], data: [] };
  }, [selectedOption, expenseChartData, incomeChartData]);

  // Prepare pie chart data
  const pieChartData = useMemo(() => {
    return chartData.labels.map((label, index) => ({
      key: `pie-${index}`, // required for the chart
      value: chartData.data[index] * 100,
      svg: {
        fill: getColorByIndex(index.toString()),
      },
      label,
    }));
  }, [chartData, isDark]);

  // Prepare progress data for the selected option
  const expenseProgressData = useMemo(() => {
    return groupExpensesByCategory(expenseData ?? []);
  }, [expenseData]);

  const incomeProgressData = useMemo(() => {
    return groupExpensesByCategory(incomeData ?? []);
  }, [incomeData]);

  const progressData = useMemo(() => {
    if (selectedOption?.value === ExpenseState.ExpenseOverview) {
      return expenseProgressData;
    } else if (selectedOption?.value === ExpenseState.IncomeOverview) {
      return incomeProgressData;
    }
    return [];
  }, [selectedOption, expenseProgressData, incomeProgressData]);

  // Calculate totals
  const totalExpense = useMemo(() => {
    return expenseData?.reduce((sum, exp) => sum + Number(exp.amount), 0) || 0;
  }, [expenseData]);

  const totalIncome = useMemo(() => {
    return incomeData?.reduce((sum, inc) => sum + Number(inc.amount), 0) || 0;
  }, [incomeData]);

  const netBalance = totalIncome + totalExpense;

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1 }} className="bg-background">
      <ScrollView
        className="bg-background px-5"
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{
          paddingBottom: Platform.OS === "ios" ? 80 : 70,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Header title="Stats" subtitle={formattedBalance(netBalance)} />

        {/* Date Filter Selection */}

        <DateFilter />

        {/* Analysis Type Selection */}
        <Text className="text-foreground text-lg font-bold mb-3">
          Analysis Type
        </Text>
        <ScrollView
          className="pt-2 gap-2"
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          <View className="">
            <ToggleGroup
              type="single"
              options={EXPENSE_STATES}
              value={selectedOption?.value}
              onChange={(value) =>
                setSelectedOption(
                  EXPENSE_STATES.find((opt) => opt.value === value) ||
                    EXPENSE_STATES[0],
                )
              }
            />
          </View>
        </ScrollView>

        {/* Content Area */}
        <View className="bg-card rounded-2xl p-4  border border-border my-6">
          {/* Expense overview */}
          {selectedOption?.value === ExpenseState.ExpenseOverview && (
            <View>
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-foreground text-xl font-bold">
                  Expense Overview
                </Text>
              </View>
              <Overview
                progressData={progressData}
                pieChartData={pieChartData}
              />
            </View>
          )}

          {/* Income overview */}
          {selectedOption?.value === ExpenseState.IncomeOverview && (
            <View>
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-foreground text-xl font-bold">
                  Income Overview
                </Text>
              </View>
              <Overview
                progressData={progressData}
                pieChartData={pieChartData}
              />
            </View>
          )}

          {/* Expense flow chart */}
          {selectedOption?.value === ExpenseState.ExpenseFlow && (
            <View>
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-foreground text-xl font-bold">
                  Expense Flow
                </Text>
                <View className="bg-red-500/10 px-3 py-1.5 rounded-full">
                  <Text className="text-red-500 text-xs font-semibold">
                    Trend
                  </Text>
                </View>
              </View>
              <LineChart
                data={lineChartData}
                color={"#ef4444"}
                yAxisLabel="$"
              />
            </View>
          )}

          {/* Income flow chart */}
          {selectedOption?.value === ExpenseState.IncomeFlow && (
            <View>
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-foreground text-xl font-bold">
                  Income Flow
                </Text>
                <View className="bg-green-500/10 px-3 py-1.5 rounded-full">
                  <Text className="text-green-500 text-xs font-semibold">
                    Trend
                  </Text>
                </View>
              </View>
              <LineChart
                data={lineChartData}
                color={"#22c55e"}
                yAxisLabel="$"
              />
            </View>
          )}

          {selectedOption?.value === ExpenseState.AccountAnalysis && (
            <View>
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-foreground text-xl font-bold">
                  Account Analysis
                </Text>
              </View>
              <AccountAnalysis expenses={expenses} accounts={accounts} />
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Analysis;
