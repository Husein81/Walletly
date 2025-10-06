// Global imports
import { format } from "date-fns";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Local imports
import {
  AddTransactionSection,
  ExpenseForm,
  ExpensesList,
  QuickStats,
} from "@/components/Expense";
import { Text } from "@/components/ui";
import { ListSkeleton, TransactionsCard } from "@/components/ui-components";
import { Header } from "@/components/ui-components/Header";
import { useGetExpenses } from "@/hooks/expense";
import { Icon } from "@/lib/icons/Icon";
import { Expense } from "@/types";

//store imports
import { useAuthStore, useDateStore, useModalStore } from "@/store";

const Home = () => {
  const { user } = useAuthStore();
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

  useEffect(() => {
    refetch();
  }, [expenses, refetch, selectedDate]);

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
    <SafeAreaView edges={["top"]} className="flex-1 bg-background">
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{
          paddingBottom: Platform.OS === "ios" ? 80 : 70,
        }}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <Header />

        {/* Modern Quick Add Section - Always Visible at Top */}
        <AddTransactionSection onPress={handleOpenForm} />

        <TransactionsCard
          total={totalBalance ?? 0}
          income={totalIncome ?? 0}
          expense={totalExpense ?? 0}
        />
        {expenses && expenses.length > 0 ? (
          <View>
            {/* Quick Stats Section */}
            <QuickStats
              numOfExpenses={expenses.length}
              selectedDate={selectedDate}
            />

            {/* Recent Transactions Header */}
            <View className="flex-row items-center justify-between mb-4">
              <View>
                <Text className="text-foreground text-2xl font-bold">
                  Recent Transactions
                </Text>
                <Text className="text-muted-foreground text-sm mt-1">
                  {expenses.length} transaction
                  {expenses.length !== 1 ? "s" : ""} this month
                </Text>
              </View>
              <Pressable
                onPress={handleOpenForm}
                className="bg-blue-500/85 px-4 py-2 rounded-full active:scale-95"
              >
                <Text className="text-primary text-sm font-semibold">
                  + Add
                </Text>
              </Pressable>
            </View>

            <ExpensesList expensesSections={expensesSections ?? []} />
          </View>
        ) : expenses?.length === 0 ? (
          <View className="flex-1 px-5">
            {/* Empty State with Better Design */}
            <View className="mt-8 items-center">
              <View className="bg-muted/30 rounded-full p-8 mb-6">
                <Icon name="Wallet" size={48} color="#9ca3af" />
              </View>
              <Text className="text-foreground text-2xl font-bold mb-2 text-center">
                No Transactions Yet
              </Text>
              <Text className="text-muted-foreground text-base text-center mb-8 px-8">
                Start tracking your expenses by adding your first transaction
                below
              </Text>

              {/* Quick Action Cards */}
              <View className="w-full gap-3 ">
                {/* Primary Add Button */}
                <Pressable
                  onPress={handleOpenForm}
                  className="shadow-lg opacity-100 pb-4"
                >
                  <View className="items-center flex-row px-2 gap-4 border border-blue-500/50 bg-primary/10 rounded-2xl">
                    <Icon
                      name="Plus"
                      size={24}
                      color="#1fa3e3"
                      className="rounded-full border-blue-500 border bg-blue-500/30 p-2"
                      strokeWidth={2.5}
                    />

                    <View className="flex-1 py-4 text-center">
                      <Text className="text-white text-sm font-bold">
                        Add Your First Transaction
                      </Text>
                      <Text className="text-white/80 text-xs">
                        Start tracking by adding an expense, income, or transfer
                      </Text>
                    </View>
                    <Icon name="ChevronRight" size={20} color="white" />
                  </View>
                </Pressable>
              </View>
            </View>
          </View>
        ) : (
          <ListSkeleton />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
export default Home;
