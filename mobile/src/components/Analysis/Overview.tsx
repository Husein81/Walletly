// Global imports
import { useMemo } from "react";
import { Dimensions, Text, View } from "react-native";
import { PieChart } from "react-native-chart-kit";

// local imports
import { Progress, Separator } from "~/components/ui";
import { getColorByIndex } from "~/functions";
import { iconsRecord, NAV_THEME } from "~/lib/config";
import { Icon } from "~/lib/icons/Icon";
import { useColorScheme } from "~/lib/useColorScheme";
import { Expense } from "~/types";

type PieChartData = {
  name: string;
  population: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
};

type Props = {
  pieChartData: PieChartData[];
  progressData: {
    id: string;
    name: string;
    amount: number;
    category: Expense["category"];
  }[];
};

const SCREEN_WIDTH = Dimensions.get("window").width;

const Overview = ({ pieChartData, progressData }: Props) => {
  const { isDarkColorScheme } = useColorScheme();
  const totalExpense: number = useMemo(
    () => (progressData ?? []).reduce((sum, item) => sum + item.amount, 0),
    [progressData]
  );

  return (
    <View>
      <PieChart
        data={pieChartData}
        width={SCREEN_WIDTH}
        height={220}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="16"
        center={[10, 10]}
        chartConfig={{
          backgroundGradientFrom: isDarkColorScheme
            ? NAV_THEME.dark.background
            : NAV_THEME.light.background,
          backgroundGradientTo: isDarkColorScheme
            ? NAV_THEME.dark.background
            : NAV_THEME.light.background,
          color: () => "#ff5e5e",
        }}
        hasLegend={true}
      />

      <View className=" px-4 gap-4">
        <Separator className="my-4 " />
        {progressData?.map((item, index) => (
          <View key={item.id} className="w-full gap-2">
            <View className="flex-1 flex-row items-center justify-between gap-4">
              <View
                style={{
                  backgroundColor: getColorByIndex(index.toString()),
                }}
                className="h-10 w-10 rounded-lg items-center justify-center"
              >
                <Icon
                  name={iconsRecord[item.category?.imageUrl || "other"]}
                  color={isDarkColorScheme ? "#fff" : "#000"}
                />
              </View>
              <View className="flex-1">
                <Text className="text-primary capitalize font-semibold">
                  {item.name}
                </Text>
                <Progress
                  className=" rounded-md"
                  indicatorColor={getColorByIndex(index.toString())}
                  value={(item.amount * 100) / totalExpense}
                />
                <Text className="text-sm text-gray-500">
                  {((item.amount * 100) / totalExpense).toFixed(2)}%
                </Text>
              </View>
            </View>
            <Separator />
          </View>
        ))}
      </View>
    </View>
  );
};

export default Overview;
