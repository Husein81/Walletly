// Global imports
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Animated,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { useRef, useState } from "react";

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
import { useCallback, useMemo } from "react";
import { useFocusEffect } from "expo-router";

const Home = () => {
  const { user } = useAuthStore();
  const { isDarkColorScheme } = useColorScheme();
  const { onOpen } = useModalStore();

  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current; // 0 = visible, 1 = hidden

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    const isScrollingDown = currentOffset > prevScrollPos;

    Animated.timing(fadeAnim, {
      toValue: isScrollingDown ? 1 : 0,
      duration: 100, // faster animation
      useNativeDriver: true,
    }).start();

    setPrevScrollPos(currentOffset);
  };

  const { data: expenses, refetch } = useGetExpenses(
    user?.id ?? "",
    "2025",
    "5"
  );

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

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

  const totalBalance = useMemo(() => {
    if (!expenses?.length) return 0;
    return expenses.reduce(
      (acc, expense) => acc + Number(expense.amount || 0),
      0
    );
  }, [expenses]);

  const totalIncome = useMemo(() => {
    if (!expenses?.length) return 0;
    return expenses
      .filter((ex) => ex.type === "INCOME")
      .reduce((acc, expense) => acc + Number(expense.amount || 0), 0);
  }, [expenses]);

  const totalExpense = useMemo(() => {
    if (!expenses?.length) return 0;
    return expenses
      .filter((ex) => ex.type === "EXPENSE")
      .reduce((acc, expense) => acc + Number(expense.amount || 0), 0);
  }, [expenses]);

  return (
    <SafeAreaView className="flex-1 px-4 gap-8">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <StackedCards
          total={totalBalance ?? 0}
          income={totalIncome ?? 0}
          expense={totalExpense ?? 0}
        />
        <ExpensesList expensesSections={expensesSections ?? []} />
      </ScrollView>
      <Animated.View
        style={{
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 100], // slide down by 100 when hidden
              }),
            },
          ],
          position: "absolute",
          bottom: 40,
          right: 16,
        }}
      >
        <Icon
          name="Plus"
          size={32}
          onPress={handleOpenForm}
          className="bg-primary rounded-full p-3"
          color={isDarkColorScheme ? "#000" : "#fff"}
        />
      </Animated.View>
    </SafeAreaView>
  );
};
export default Home;
