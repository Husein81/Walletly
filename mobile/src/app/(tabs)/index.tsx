// Global imports
import { format } from "date-fns";
import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Local imports
import { ExpenseForm, ExpensesList } from "~/components/Expense";
import { Separator, Text } from "~/components/ui";
import { Empty, ListSkeleton, StackedCards } from "~/components/ui-components";
import { Header } from "~/components/ui-components/Header";
import { useGetExpenses } from "~/hooks/expense";
import { Icon } from "~/lib/icons/Icon";
import { useColorScheme } from "~/lib/useColorScheme";
import { Expense } from "~/types";

//store imports
import { useAuthStore, useDateStore, useModalStore } from "~/store";

const Home = () => {
  const { user } = useAuthStore();
  const { isDarkColorScheme } = useColorScheme();
  const { onOpen } = useModalStore();
  const { selectedDate } = useDateStore();

  const [prevScrollPos, setPrevScrollPos] = useState(0);

  const fadeAnim = useRef(new Animated.Value(0)).current; // 0 = visible, 1 = hidden

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    const isScrollingDown = currentOffset > 0 && currentOffset > prevScrollPos;

    Animated.timing(fadeAnim, {
      toValue: isScrollingDown ? 1 : 0,
      duration: 100, // faster animation
      useNativeDriver: true,
    }).start();

    setPrevScrollPos(currentOffset);
  };

  const { data: expenses, refetch } = useGetExpenses(user?.id ?? "", {
    year: selectedDate.getFullYear().toString(),
    month: (selectedDate.getMonth() + 1).toString(),
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch, selectedDate])
  );

  const handleOpenForm = () => onOpen(<ExpenseForm />, "Add Expense");

  const expensesSections = useMemo(() => {
    if (!expenses) return [];

    const groupedMap = new Map<string, { title: string; data: Expense[] }>();

    for (const expense of expenses) {
      const date = new Date(expense.updatedAt);
      const dateKey = date.toDateString();
      if (!groupedMap.has(dateKey)) {
        groupedMap.set(dateKey, {
          title: format(date, "EEE, dd MMM"),
          data: [],
        });
      }
      groupedMap.get(dateKey)!.data.push(expense);
    }

    return Array.from(groupedMap.entries())
      .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
      .map(([_, value]) => value);
  }, [expenses]);

  const totalBalance = useMemo(() => {
    if (!expenses?.length) return 0;
    return expenses
      .filter((expense) => expense.type !== "TRANSFER")
      .reduce((acc, expense) => acc + Number(expense.amount || 0), 0);
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
    <SafeAreaView edges={["top"]} className="flex-1 p-4 gap-8">
      <Header />
      {expenses && expenses.length > 0 ? (
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
          <Text className="text-text text-primary text-2xl font-semibold my-2">
            Recent Transaction
          </Text>
          <ExpensesList expensesSections={expensesSections ?? []} />
        </ScrollView>
      ) : expenses?.length === 0 ? (
        <ScrollView className="flex-1 ">
          <StackedCards total={0} income={0} expense={0} />
          <Separator className="my-2" />
          <Empty
            title="No expenses found"
            description="You can add your first expense by clicking the button below."
            icon="Plus"
          />
        </ScrollView>
      ) : (
        <ListSkeleton />
      )}
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
