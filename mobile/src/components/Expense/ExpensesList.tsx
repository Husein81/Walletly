//Global Imports
import { Text, View } from "react-native";

// Local Imports
import { Expense } from "~/types";
import { ExpenseCard } from "./ExpenseCard";
import { Separator } from "../ui";

type Props = {
  expensesSections: Array<{ title: string; data: Expense[] }>;
};

export const ExpensesList = ({ expensesSections }: Props) => {
  return (
    <View>
      {expensesSections.map((section) => (
        <View key={section.title} className="mb-6">
          {/* Section Header */}
          <View className="py-4 gap-2">
            <Text className=" font-bold text-primary">{section.title}</Text>
            <Separator />
          </View>

          {/* Expenses in Section */}
          {section.data.map((expense) => (
            <ExpenseCard key={expense.id} expense={expense} />
          ))}
        </View>
      ))}
    </View>
  );
};
