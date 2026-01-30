//Global Imports
import { Text, View } from "react-native";

// Local Imports
import { Expense } from "@/types";
import { ExpenseCard } from "./ExpenseCard";
import { Separator } from "../ui";

type Props = {
  expenses: Array<Expense>;
};

export const ExpensesList = ({ expenses }: Props) => {
  return (
    <View className="flex gap-4">
      {expenses.map((expense) => (
        <ExpenseCard key={expense.id} expense={expense} />
      ))}
    </View>
  );
};
