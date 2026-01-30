import { ExpenseForm } from "@/components/Expense";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const Expense = () => {
  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-background">
      <ScrollView
        className="flex-1 px-8 pb-12"
        showsVerticalScrollIndicator={false}
      >
        <ExpenseForm />
      </ScrollView>
    </SafeAreaView>
  );
};
export default Expense;
