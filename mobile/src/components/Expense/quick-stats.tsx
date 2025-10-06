import { Icon } from "@/lib/icons/Icon";
import { View, Text } from "react-native";
import { format } from "date-fns";
import { StatsCard } from "../ui-components";

type Props = {
  numOfExpenses: number;
  selectedDate: Date;
};
const QuickStats = ({ numOfExpenses, selectedDate }: Props) => {
  return (
    <View className="flex-row gap-3 mb-6">
      {/* Total Transactions */}
      <StatsCard
        title="Total Transaction"
        value={numOfExpenses}
        icon="Receipt"
        iconColor="#3b82f6"
      />

      {/* This Month */}
      <StatsCard
        title="This Month"
        value={format(selectedDate, "MMM")}
        icon="Calendar"
        iconColor="#a855f7"
      />
    </View>
  );
};
export default QuickStats;
