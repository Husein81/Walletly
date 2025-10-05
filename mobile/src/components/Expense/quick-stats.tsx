import { Icon } from "@/lib/icons/Icon";
import { View, Text } from "react-native";
import { format } from "date-fns";

type Props = {
  numOfExpenses: number;
  selectedDate: Date;
};
const QuickStats = ({ numOfExpenses, selectedDate }: Props) => {
  return (
    <View className="flex-row gap-3 mb-6">
      {/* Total Transactions */}
      <View className="flex-1 bg-card shadow-md rounded-2xl p-4 border border-border/50">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-muted-foreground text-xs font-medium">
            Total Transactions
          </Text>
          <View className="bg-primary/10 p-2 rounded-full">
            <Icon name="Receipt" size={16} color="#3b82f6" />
          </View>
        </View>
        <Text className="text-foreground text-2xl font-bold">
          {numOfExpenses}
        </Text>
      </View>

      {/* This Month */}
      <View className="flex-1 bg-card shadow-md rounded-2xl p-4 border border-border/50">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-muted-foreground text-xs font-medium">
            This Month
          </Text>
          <View className="bg-accent/10 p-2 rounded-full">
            <Icon name="Calendar" size={16} color="#a855f7" />
          </View>
        </View>
        <Text className="text-foreground text-2xl font-bold">
          {format(selectedDate, "MMM")}
        </Text>
      </View>
    </View>
  );
};
export default QuickStats;
