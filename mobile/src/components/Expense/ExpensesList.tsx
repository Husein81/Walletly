import { Text, View } from "react-native";
import { Expense } from "~/types";
import ExpenseCard from "./ExpenseCard";

type Props = {
  expensesSections: Array<{ title: string; data: Expense[] }>;
};

const ExpensesList = ({ expensesSections }: Props) => {
  return (
    <View>
      {expensesSections.map((section) => (
        <View key={section.title} className="mb-6">
          {/* Section Header */}
          <View className="py-4 gap-2">
            <Text className="text-lg font-bold text-primary">
              {section.title}
            </Text>
            <View className="w-full mx-auto h-px bg-primary" />
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

export default ExpensesList;
