import { useCallback, useMemo, useState } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";

// Local imports
import { useGetExpenses } from "~/hooks/expense";
import { useAuthStore } from "~/store/authStore";
import { Input, Separator } from "../ui";
import ExpensesList from "./ExpensesList";
import { Empty, ListSkeleton } from "../ui-components";
import { useFocusEffect } from "expo-router";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuthStore();

  const {
    data: expenses,
    refetch,
    isLoading,
  } = useGetExpenses(user?.id ?? "", {});

  const handleSearch = (text: string) => {
    setSearchTerm(text);
  };

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const filteredExpenses = useMemo(
    () =>
      expenses?.filter(
        (expense) =>
          expense.category?.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          expense.fromAccount.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      ),
    [expenses, searchTerm]
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 w-full py-2 "
    >
      <Input
        placeholder="Search"
        className="rounded-xl"
        onChangeText={handleSearch}
      />
      {isLoading ? (
        <ListSkeleton />
      ) : filteredExpenses && filteredExpenses.length === 0 ? (
        <View className="flex-1 items-center justify-center mt-12">
          <Separator className="mb-4 mt-2" />
          <Empty
            icon="Info"
            title="No expenses found"
            description="Try searching for a different term."
          />
        </View>
      ) : (
        <ExpensesList
          expensesSections={[{ title: "", data: filteredExpenses ?? [] }]}
        />
      )}
    </KeyboardAvoidingView>
  );
};
export default Search;
