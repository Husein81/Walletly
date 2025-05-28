import { Dimensions, ScrollView, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";

// local imports
import { useMemo, useState } from "react";
import { Overview } from "~/components/Analysis/";
import Selection from "~/components/ui-components/Selection";
import { Option } from "~/components/ui/select";
import {
  getCategoryChartData,
  getColorByIndex,
  groupExpensesByCategory,
  transformExpensesToChartData,
} from "~/functions";
import { useGetExpenses } from "~/hooks/expense";
import { NAV_THEME } from "~/lib/config";

//store imports
import { useColorScheme } from "~/lib/useColorScheme";
import { useAuthStore } from "~/store/authStore";

enum ExpenseState {
  EXPENSE_OVERVIEW = "EXPENSE_OVERVIEW",
  INCOME_OVERVIEW = "INCOME_OVERVIEW",
  EXPENSE_FLOW = "EXPENSE_FLOW",
  INCOME_FLOW = "INCOME_FLOW",
  ACCOUNT_ANALYSIS = "ACCOUNT_ANALYSIS",
}

const options: Option[] = [
  { label: "Expense Overview", value: ExpenseState.EXPENSE_OVERVIEW },
  { label: "Income Overview", value: ExpenseState.INCOME_OVERVIEW },
  { label: "Expense Flow", value: ExpenseState.EXPENSE_FLOW },
  { label: "Income Flow", value: ExpenseState.INCOME_FLOW },
  { label: "Account Analysis", value: ExpenseState.ACCOUNT_ANALYSIS },
];

const screenWidth = Dimensions.get("window").width;

const Analysis = () => {
  const { user } = useAuthStore();
  const { isDarkColorScheme } = useColorScheme();

  const [selectedOption, setSelectedOption] = useState<Option>(options[0]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { data: expenses } = useGetExpenses(user?.id || "", {
    month: (selectedDate.getMonth() + 1).toString(),
    year: selectedDate.getFullYear().toString(),
  });

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
    if (selectedOption?.value === ExpenseState.EXPENSE_FLOW) {
      return expenseLineChartData;
    } else if (selectedOption?.value === ExpenseState.INCOME_FLOW) {
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
    if (selectedOption?.value === ExpenseState.EXPENSE_OVERVIEW) {
      return expenseChartData;
    } else if (selectedOption?.value === ExpenseState.INCOME_OVERVIEW) {
      return incomeChartData;
    }
    return { labels: [], data: [] };
  }, [selectedOption, expenseChartData, incomeChartData]);

  // Prepare pie chart data
  const pieChartData = useMemo(() => {
    return chartData.labels.map((label, index) => ({
      name: label.charAt(0).toUpperCase() + label.slice(1),
      population: chartData.data[index],
      color: getColorByIndex(index.toString()), // Random color for each category
      legendFontColor: isDarkColorScheme ? "#fff" : "#000",
      legendFontSize: 12,
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
    if (selectedOption?.value === ExpenseState.EXPENSE_OVERVIEW) {
      return expenseProgressData;
    } else if (selectedOption?.value === ExpenseState.INCOME_OVERVIEW) {
      return incomeProgressData;
    }
    return [];
  }, [selectedOption, expenseProgressData, incomeProgressData]);

  return (
    <SafeAreaView className="flex-1 gap-8 -z-10">
      <View className="px-8 items-center justify-center my-8">
        <Selection
          className="w-2/3"
          defaultValue={selectedOption}
          onValueChange={setSelectedOption}
          options={options}
        />
      </View>

      <ScrollView>
        {/* Expense overview */}
        {selectedOption?.value === ExpenseState.EXPENSE_OVERVIEW && (
          <Overview progressData={progressData} pieChartData={pieChartData} />
        )}
        {/* Income overview */}
        {selectedOption?.value === ExpenseState.INCOME_OVERVIEW && (
          <Overview progressData={progressData} pieChartData={pieChartData} />
        )}

        {/* Expense flow chart */}
        {selectedOption?.value === ExpenseState.EXPENSE_FLOW && (
          <LineChart
            data={lineChartData}
            width={screenWidth - 20}
            height={220}
            yAxisLabel="$"
            chartConfig={{
              backgroundGradientFrom: isDarkColorScheme
                ? NAV_THEME.dark.background
                : NAV_THEME.light.background,
              backgroundGradientTo: isDarkColorScheme
                ? NAV_THEME.dark.background
                : NAV_THEME.light.background,
              color: () => `#ff5e5e`,
              propsForBackgroundLines: {
                stroke: "transparent",
              },
              propsForDots: {
                r: "3",
                strokeWidth: "1",
                stroke: "#ff5e5e",
                fill: "transparent", // Makes the dot hollow
              },
            }}
            style={{ borderRadius: 8, marginTop: 16 }}
          />
        )}

        {/* Income flow chart */}
        {selectedOption?.label === "Income flow" && (
          <LineChart
            data={lineChartData}
            width={screenWidth - 20}
            height={220}
            yAxisLabel="$"
            chartConfig={{
              backgroundGradientFrom: isDarkColorScheme
                ? NAV_THEME.dark.background
                : NAV_THEME.light.background,
              backgroundGradientTo: isDarkColorScheme
                ? NAV_THEME.dark.background
                : NAV_THEME.light.background,
              color: () => (isDarkColorScheme ? "#5c5c" : "#2A9D8F"),
              propsForDots: {
                r: "3",
                strokeWidth: "1",
                stroke: isDarkColorScheme ? "#5c5c" : "#2A9D8F",
                fill: "transparent", // Makes the dot hollow
              },
              propsForBackgroundLines: {
                stroke: "transparent",
              },
            }}
            style={{ borderRadius: 8, marginTop: 16 }}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Analysis;
