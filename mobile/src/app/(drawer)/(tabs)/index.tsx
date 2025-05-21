// Global imports
import { SafeAreaView } from "react-native-safe-area-context";

// Local imports
import ExpenseForm from "~/components/Expense/ExpenseForm";
import ExpensesList from "~/components/Expense/ExpensesList";
import { formatDateToMMMddDay } from "~/functions";
import { useGetExpenses } from "~/hooks/expense";
import { Icon } from "~/lib/icons/Icon";
import { useColorScheme } from "~/lib/useColorScheme";
import { Expense } from "~/types";

//store imports
import { useAuthStore } from "~/store/authStore";
import useModalStore from "~/store/modalStore";
import StackedCards from "~/components/ui-components/StackedCards";
import { useMemo } from "react";

const Home = () => {
  const { user } = useAuthStore();
  const { isDarkColorScheme } = useColorScheme();
  const { onOpen } = useModalStore();

  const { data: expenses } = useGetExpenses(user?.id ?? "", "2025", "5");

  const handleOpenForm = () => onOpen(<ExpenseForm />, "");

  const groupedMap = new Map<string, { title: string; data: Expense[] }>();

  for (const expense of expenses ?? []) {
    const date = new Date(expense.updatedAt);
    const dateKey = date.toDateString(); // e.g., "Mon May 20 2025"
    if (!groupedMap.has(dateKey)) {
      groupedMap.set(dateKey, {
        title: formatDateToMMMddDay(date), // format once, not later
        data: [],
      });
    }
    groupedMap.get(dateKey)!.data.push(expense);
  }

  const expensesSections = Array.from(groupedMap.entries())
    .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
    .map(([_, value]) => value);

  const totalBalance = useMemo(
    () => expenses?.reduce((acc, expense) => acc + Number(expense.amount), 0),
    [expenses]
  );

  const totalIncome = useMemo(
    () =>
      expenses
        ?.filter((ex) => ex.type === "INCOME")
        .reduce((acc, expense) => acc + Number(expense.amount), 0),
    [expenses]
  );

  const totalExpense = useMemo(
    () =>
      expenses
        ?.filter((ex) => ex.type === "EXPENSE")
        .reduce((acc, expense) => acc + Number(expense.amount), 0),
    [expenses]
  );

  return (
    <SafeAreaView className="flex-1 px-4 gap-8">
      <StackedCards
        total={totalBalance ?? 0}
        income={totalIncome ?? 0}
        expense={totalExpense ?? 0}
      />
      <ExpensesList expensesSections={expensesSections ?? []} />
      <Icon
        name="Plus"
        size={32}
        onPress={handleOpenForm}
        className="absolute bottom-10 right-4 bg-primary rounded-full p-3"
        color={isDarkColorScheme ? "#000" : "#fff"}
      />
    </SafeAreaView>
  );
};
export default Home;
