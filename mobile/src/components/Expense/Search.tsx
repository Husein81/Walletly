import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";

// Local imports
import { useGetExpenses } from "@/hooks/expense";
import { Input, Separator } from "../ui";
import { Empty, ListSkeleton } from "../ui-components";
import { ExpensesList } from "./ExpensesList";

// Store imports
import { useAuthStore } from "@/store";

export const Search = () => {
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
