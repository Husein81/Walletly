import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// local imports
import { useCallback, useMemo, useState } from "react";
import { LineChart } from "~/components/Analysis";
import { Overview } from "~/components/Analysis/";
import { Selection } from "~/components/ui-components";
import { Header } from "~/components/ui-components/Header";
import { Option } from "~/components/ui/select";
import {
  getCategoryChartData,
  getColorByIndex,
  getGroupedBarChartData,
  groupExpensesByCategory,
  transformExpensesToChartData,
} from "~/functions";
import { useGetExpenses } from "~/hooks/expense";
import { NAV_THEME } from "~/lib/config";

//store imports
import { useFocusEffect } from "expo-router";
import { useColorScheme } from "~/lib/useColorScheme";
import { useDateStore } from "~/store";
import { useAuthStore } from "~/store/authStore";
import AccountAnalysis from "~/components/Analysis/AccountAnalysis";
import { useGetAccounts } from "~/hooks/accounts";

enum ExpenseState {
  ExpenseOverview = "EXPENSE_OVERVIEW",
  IncomeOverview = "INCOME_OVERVIEW",
  ExpenseFlow = "EXPENSE_FLOW",
  IncomeFlow = "INCOME_FLOW",
  AccountAnalysis = "ACCOUNT_ANALYSIS",
}

const options: Option[] = [
  { label: "Expense Overview", value: ExpenseState.ExpenseOverview },
  { label: "Income Overview", value: ExpenseState.IncomeOverview },
  { label: "Expense Flow", value: ExpenseState.ExpenseFlow },
  { label: "Income Flow", value: ExpenseState.IncomeFlow },
  { label: "Account Analysis", value: ExpenseState.AccountAnalysis },
];

const Analysis = () => {
  const { user } = useAuthStore();
  const { isDarkColorScheme } = useColorScheme();

  const [selectedOption, setSelectedOption] = useState<Option>(options[0]);
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

  return (
    <SafeAreaView className="flex-1 gap-8 p-4">
      <Header />
      <View className="px-8 items-center justify-center mb-8">
        <Selection
          defaultValue={selectedOption}
          onValueChange={setSelectedOption}
          options={options}
        />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Expense overview */}
        {selectedOption?.value === ExpenseState.ExpenseOverview && (
          <Overview progressData={progressData} pieChartData={pieChartData} />
        )}
        {/* Income overview */}
        {selectedOption?.value === ExpenseState.IncomeOverview && (
          <Overview progressData={progressData} pieChartData={pieChartData} />
        )}

        {/* Expense flow chart */}
        {selectedOption?.value === ExpenseState.ExpenseFlow && (
          <LineChart
            data={lineChartData}
            color={isDarkColorScheme ? "#FF5E5E" : "#FF6E6E"}
            yAxisLabel="$"
          />
        )}

        {/* Income flow chart */}
        {selectedOption?.value === ExpenseState.IncomeFlow && (
          <LineChart
            data={lineChartData}
            color={isDarkColorScheme ? "#5c5c" : "#3c3c"}
            yAxisLabel="$"
          />
        )}

        {selectedOption?.value === ExpenseState.AccountAnalysis && (
          <AccountAnalysis expenses={expenses} accounts={accounts} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Analysis;
