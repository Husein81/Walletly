// Global imports
import { useMemo, useRef, useState } from "react";
import {
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Local imports
import { ExpenseForm, ExpensesList, Search } from "@/components/Expense";
import { Text } from "@/components/ui";
import {
  ListSkeleton,
  TransactionsCard,
  UserDropdown,
} from "@/components/ui-components";
import { Header } from "@/components/ui-components/Header";
import { useGetExpenses } from "@/hooks/expense";
import { Icon } from "@/lib/icons/Icon";

//store imports
import DateFilter from "@/components/ui-components/DateFilter";
import { useAuthStore, useDateStore, useModalStore } from "@/store";
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

const Home = () => {
  const { user } = useAuthStore();
  const { onOpen } = useModalStore();
  const { selectedDate, setSelectedDate, dateRangeType } = useDateStore();

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

  // Calculate date parameters based on selected range type
  const dateParams = useMemo(() => {
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
      default:
        return {
          year: selectedDate.getFullYear().toString(),
          month: (selectedDate.getMonth() + 1).toString(),
        };
    }
  }, [selectedDate, dateRangeType]);

  const { data: expenses, isLoading } = useGetExpenses(user?.id!, dateParams);

  const handleOpenForm = () => onOpen(<ExpenseForm />, "Add Expense");

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

  const handleOpenSearch = () => onOpen(<Search />, "Search");

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
        <Header
          title={user?.name}
          subtitle={user?.phone}
          action={<UserDropdown />}
          hasGreeting
        />

        <DateFilter date={selectedDate} onChange={setSelectedDate} />

        <TransactionsCard
          total={totalBalance ?? 0}
          income={totalIncome ?? 0}
          expense={totalExpense ?? 0}
        />

        {isLoading ? (
          <ListSkeleton />
        ) : expenses && expenses.length > 0 ? (
          <View>
            {/* Recent Transactions Header */}
            <View className="flex-row items-center justify-between mb-4">
              <View>
                <Text className="text-foreground text-xl font-bold">
                  Recent Transactions
                </Text>
                <Text className="text-muted-foreground text-sm mt-1">
                  {expenses.length} transaction
                  {expenses.length !== 1 ? "s" : ""}{" "}
                  {dateRangeType === "today"
                    ? "today"
                    : dateRangeType === "week"
                      ? "this week"
                      : dateRangeType === "year"
                        ? "this year"
                        : "this month"}
                </Text>
              </View>
              <TouchableOpacity onPress={handleOpenSearch}>
                <View>
                  <Text className="text-primary text-sm font-semibold">
                    See all
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <ExpensesList expenses={expenses ?? []} />
          </View>
        ) : (
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
                  <View className="items-center flex-row px-2 gap-4 border border-teal-500/50 bg-primary/10 rounded-2xl">
                    <Icon
                      name="Plus"
                      size={24}
                      color="#14B8A6"
                      className="rounded-full border-teal-500 border bg-teal-500/30 p-2"
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
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
export default Home;
