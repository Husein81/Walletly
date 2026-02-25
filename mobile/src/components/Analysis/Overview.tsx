import React, { useMemo } from "react";
import { View } from "react-native";
import { PieChart, SvgData } from "react-native-svg-charts";
import { getColorByIndex } from "@/utils";
import { iconsRecord, SCREEN_WIDTH } from "@/constants";
import { Icon } from "@/components/ui";
import { useColorScheme } from "@/lib/useColorScheme";
import { Progress, Separator, Text } from "../ui";
import { Text as TextSVG } from "react-native-svg";
import { Expense } from "@/types";
import { Empty } from "../ui-components";

type Props = {
  pieChartData: SvgData[];
  progressData: {
    id: string;
    name: string;
    amount: number;
    category: Expense["category"];
  }[];
};

const Overview = ({ pieChartData, progressData }: Props) => {
  const { isDarkColorScheme } = useColorScheme();

  const totalExpense = useMemo(
    () => (progressData ?? []).reduce((sum, item) => sum + item.amount, 0),
    [progressData],
  );
  // Donut center text
  const Labels = ({
    slices,
  }: {
    slices?: {
      pieCentroid: number[];
      data: { value: number };
    }[];
  }) => {
    return slices?.map((slice, index) => {
      const { pieCentroid, data } = slice;
      return (
        <TextSVG
          key={index}
          x={pieCentroid[0]}
          y={pieCentroid[1]}
          fill={"white"}
          textAnchor={"middle"}
          alignmentBaseline={"middle"}
          fontSize={16}
          stroke={"black"}
          strokeWidth={0.2}
        >
          {data.value.toFixed(2)}
        </TextSVG>
      );
    });
  };

  if (!pieChartData || pieChartData.length === 0) {
    return (
      <View className="flex-1 items-center justify-center">
        <Empty
          title="No Data"
          description="There are no expenses to analyze for this month."
          icon="ChartPie"
        />
      </View>
    );
  }

  return (
    <View>
      <PieChart
        style={{ height: 220, width: SCREEN_WIDTH - 20 }}
        data={pieChartData}
        valueAccessor={({ item }) => item.value}
        outerRadius={"80%"}
      >
        <Labels />
      </PieChart>

      <View className="px-4 gap-4">
        <Separator className="my-4" />
        {progressData?.map((item, index) => (
          <View key={item.id} className="w-full gap-2">
            <View className="flex-1 flex-row items-center justify-between gap-4">
              <View
                style={{
                  backgroundColor: getColorByIndex(index.toString()),
                }}
                className="h-10 w-10 rounded-xl items-center justify-center"
              >
                <Icon
                  name={iconsRecord[item.category?.imageUrl || "other"]}
                  color={"#fff"}
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
            <Separator
              className={index === progressData.length - 1 ? "hidden" : ""}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

export default Overview;
