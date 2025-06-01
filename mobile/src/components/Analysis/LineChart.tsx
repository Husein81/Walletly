import { View, Text, Dimensions } from "react-native";
import { LineChart as RNLineChart } from "react-native-chart-kit";
import { NAV_THEME } from "~/lib/config";
import { useColorScheme } from "~/lib/useColorScheme";
import { Empty } from "../ui-components";

const screenWidth = Dimensions.get("window").width;

type Props = {
  data: {
    labels: string[];
    datasets: {
      data: number[];
    }[];
  };
  yAxisLabel: string;
  color: string;
  backgroundColor: string;
};

const LineChart = ({ data, yAxisLabel, color, backgroundColor }: Props) => {
  const { isDarkColorScheme } = useColorScheme();
  console.log("LineChart data:", data);
  if (data.datasets.length === 0 || data.labels.length === 0) {
    return (
      <Empty
        title="No Data Available"
        description="There is no data to display in this chart."
        icon="Info"
        className="mt-8"
      />
    );
  }

  return (
    <RNLineChart
      data={data}
      width={screenWidth - 20}
      height={220}
      yAxisLabel={yAxisLabel}
      chartConfig={{
        backgroundGradientFrom: backgroundColor,
        backgroundGradientTo: backgroundColor,
        color: () => color,
        propsForDots: {
          r: "3",
          strokeWidth: "2",
          stroke: color,
          fill: "transparent",
        },
        propsForBackgroundLines: {
          stroke: isDarkColorScheme ? "#444" : "#ccc",
          strokeDasharray: "",
        },
      }}
      withVerticalLines={false}
      style={{ marginTop: 16 }}
    />
  );
};

export default LineChart;
