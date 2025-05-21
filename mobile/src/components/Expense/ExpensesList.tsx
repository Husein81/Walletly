import { SectionList, Text, View } from "react-native";
import { Expense } from "~/types";
import ExpenseCard from "./ExpenseCard";

type Props = {
  expensesSections: Array<{ title: string; data: Expense[] }>;
};

const ExpensesList = ({ expensesSections }: Props) => {
  return (
    <SectionList
      sections={expensesSections}
      keyExtractor={(item) => item.id || Math.random().toString()}
      renderSectionHeader={({ section: { title } }) => (
        <View className="py-4 gap-2">
          <Text className="text-xl font-bold text-primary">{title}</Text>
          <View className="w-full mx-auto h-px bg-primary " />
        </View>
      )}
      renderItem={({ item }) => <ExpenseCard expense={item} />}
    />
  );
};
export default ExpensesList;
