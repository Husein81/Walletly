import { Icon } from "@/components/ui";
import { iconsRecord } from "@/constants";
import { Account, Expense } from "@/types";
import { formattedBalance, getGroupedBarChartData } from "@/utils";
import { useCallback } from "react";
import { View } from "react-native";
import { Separator, Text } from "../ui";
import { Empty } from "../ui-components";
import BarChart from "./BarChart";

type Props = {
  expenses?: Expense[];
  accounts?: Account[];
};

const AccountAnalysis = ({ expenses, accounts }: Props) => {
  const barChartData = getGroupedBarChartData(expenses || []);

  const flatData = barChartData.data.flat();

  if (barChartData.data.length === 0 || flatData.length === 0) {
    return (
      <View className="flex-1  items-center justify-center">
        <Empty
          title="No Data"
          description="There are no expenses to analyze for this month."
          icon="ChartBar"
        />
      </View>
    );
  }

  const icon = useCallback(
    (i: number) =>
      accounts?.find((acc) => acc.name === barChartData.labels[i])?.imageUrl ??
      "other",
    [accounts, barChartData.labels],
  );

  return (
    <View>
      <BarChart
        data={barChartData.data}
        labels={barChartData.labels}
        fill={"#34D399"}
      />

      <Separator className="my-4" />
      <Text className="text-lg font-semibold mt-4">Account Analysis</Text>
      {Array.from({ length: flatData.length / 2 }, (_, i) => (
        <View key={i} className="flex-row gap-4 px-4 py-2">
          <View className="flex-row  flex-1 items-center gap-2">
            <View className="p-2 rounded-xl bg-primary/10">
              <Icon color={"#14B8A6"} name={iconsRecord[icon(i)]} />
            </View>
            <Text className="text-lg">{barChartData.labels[i]}:</Text>
          </View>
          <View className=" flex-row gap-4 flex-1 justify-between items-center">
            <Text className="text-sm text-success border border-success rounded-lg p-2">
              {formattedBalance(flatData[i * 2]?.value)}
            </Text>
            <Text className="text-sm text-destructive border border-destructive rounded-lg p-2">
              {formattedBalance(flatData[i * 2 + 1]?.value)}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
};
export default AccountAnalysis;
