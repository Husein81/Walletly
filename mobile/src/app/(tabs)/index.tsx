// Global imports
import { useMemo, useRef, useState } from "react";
import {
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  TouchableOpacity,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
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
import { Icon } from "@/components/ui";

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
  const { selectedDate, dateRangeType, customStartDate, customEndDate } =
    useDateStore();

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
    <SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-background">
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
          title={user?.username ? `Hello, ${user.username}!` : "Hello!"}
          subtitle={user?.email}
          action={<UserDropdown />}
          hasGreeting
        />

        <DateFilter />

        <TransactionsCard
          total={totalBalance}
          income={totalIncome}
          expense={totalExpense}
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
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
export default Home;
