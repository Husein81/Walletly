import { Platform, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// local imports
import { LineChart } from "@/components/Analysis";
import { Overview } from "@/components/Analysis/";
import { Text } from "@/components/ui";
import { ToggleGroup } from "@/components/ui-components";
import { Header } from "@/components/ui-components/Header";
import {
  formattedBalance,
  getCategoryChartData,
  getColorByIndex,
  groupExpensesByCategory,
  transformExpensesToChartData,
} from "@/functions";
import { useGetExpenses } from "@/hooks/expense";
import { useCallback, useMemo, useState } from "react";

//store imports
import AccountAnalysis from "@/components/Analysis/AccountAnalysis";
import { ToggleOption } from "@/components/ui-components/toggle-group";
import { useGetAccounts } from "@/hooks/accounts";
import { useColorScheme } from "@/lib/useColorScheme";
import { useDateStore } from "@/store";
import { useAuthStore } from "@/store/authStore";
import { useFocusEffect } from "expo-router";

enum ExpenseState {
  ExpenseOverview = "EXPENSE_OVERVIEW",
  IncomeOverview = "INCOME_OVERVIEW",
  ExpenseFlow = "EXPENSE_FLOW",
  IncomeFlow = "INCOME_FLOW",
  AccountAnalysis = "ACCOUNT_ANALYSIS",
}

const options: ToggleOption[] = [
  {
    label: "Expense Overview",
    value: ExpenseState.ExpenseOverview,
    className: "rounded-xl px-2",
  },
  {
    label: "Income Overview",
    value: ExpenseState.IncomeOverview,
    className: "rounded-xl",
  },
  {
    label: "Expense Flow",
    value: ExpenseState.ExpenseFlow,
    className: "rounded-xl px-2",
  },
  {
    label: "Income Flow",
    value: ExpenseState.IncomeFlow,
    className: "rounded-xl px-2",
  },
  {
    label: "Account Analysis",
    value: ExpenseState.AccountAnalysis,
    className: "rounded-xl px-2",
  },
];

const Analysis = () => {
  const { user } = useAuthStore();
  const { isDarkColorScheme } = useColorScheme();

  const [selectedOption, setSelectedOption] = useState<ToggleOption>(
    options[0]
  );
  const { selectedDate } = useDateStore();

  const { data: expenses, refetch } = useGetExpenses(user?.id || "", {
    month: (selectedDate.getMonth() + 1).toString(),
    year: selectedDate.getFullYear().toString(),
  });
  const { data: accounts } = useGetAccounts(user?.id || "");

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [user?.id, refetch, selectedDate])
  );

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
    return transformExpensesToChartData(expenseData || []);
  }, [expenseData]);

  const incomeLineChartData = useMemo(() => {
    return transformExpensesToChartData(incomeData || []);
  }, [incomeData]);

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
  }, [chartData, isDarkColorScheme]);

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

  const netBalance = totalIncome - Math.abs(totalExpense);

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingBottom: Platform.OS === "ios" ? 80 : 70,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-5 pt-4">
          <Header />
        </View>

        {/* Stats Overview Cards */}
        <View className="px-5 pt-6 pb-2">
          <View className="flex-row gap-3 mb-3">
            <View className="flex-1 bg-card shadow-md rounded-2xl p-4 border border-border">
              <Text className="text-muted-foreground text-xs font-medium mb-1">
                INCOME
              </Text>
              <Text className="text-green-500 text-2xl font-bold">
                {formattedBalance(totalIncome)}
              </Text>
              <Text className="text-muted-foreground text-xs mt-1">
                {incomeData?.length || 0} transactions
              </Text>
            </View>
            <View className="flex-1 bg-card shadow-md rounded-2xl p-4 border border-border">
              <Text className="text-muted-foreground text-xs font-medium mb-1">
                EXPENSE
              </Text>
              <Text className="text-red-500 text-2xl font-bold">
                {formattedBalance(totalExpense)}
              </Text>
              <Text className="text-muted-foreground text-xs mt-1">
                {expenseData?.length || 0} transactions
              </Text>
            </View>
          </View>
          <View className="bg-card shadow-md rounded-2xl p-4 border border-border">
            <Text className="text-muted-foreground text-xs font-medium mb-1">
              NET BALANCE
            </Text>
            <Text
              className={`text-3xl font-bold ${
                netBalance >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {formattedBalance(Math.abs(netBalance))}
            </Text>
            <Text className="text-muted-foreground text-xs mt-1">
              {netBalance >= 0 ? "Surplus" : "Deficit"} this month
            </Text>
          </View>
        </View>

        {/* Analysis Type Selection */}
        <View className="px-5 pt-4 pb-2 mb-4">
          <Text className="text-foreground text-lg font-bold mb-3">
            Analysis Type
          </Text>
          <ScrollView
            className="pt-2 gap-2"
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            <View className=" ">
              <ToggleGroup
                type="single"
                options={options}
                value={selectedOption?.value}
                onChange={(value) =>
                  setSelectedOption(
                    options.find((opt) => opt.value === value) || options[0]
                  )
                }
              />
            </View>
          </ScrollView>
        </View>

        {/* Content Area */}
        <View className="bg-card rounded-2xl p-4 mx-2 border border-border mb-6">
          {/* Expense overview */}
          {selectedOption?.value === ExpenseState.ExpenseOverview && (
            <View>
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-foreground text-xl font-bold">
                  Expense Overview
                </Text>
                <View className="bg-red-500/10 px-3 py-1.5 rounded-full">
                  <Text className="text-red-500 text-xs font-semibold">
                    {expenseData?.length || 0} items
                  </Text>
                </View>
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
                <View className="bg-green-500/10 px-3 py-1.5 rounded-full">
                  <Text className="text-green-500 text-xs font-semibold">
                    {incomeData?.length || 0} items
                  </Text>
                </View>
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
                <View className="bg-primary/10 px-3 py-1.5 rounded-full">
                  <Text className="text-primary text-xs font-semibold">
                    {accounts?.length || 0} accounts
                  </Text>
                </View>
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
