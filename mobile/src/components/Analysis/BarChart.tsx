import { View, Text } from "react-native";
import { BarChart as RNBarChart } from "react-native-chart-kit";
import { NAV_THEME, SCREEN_WIDTH } from "~/lib/config";

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

const BarChart = ({ data, yAxisLabel, color, backgroundColor }: Props) => {
  return (
    <RNBarChart
      data={data}
      width={SCREEN_WIDTH - 20}
      height={220}
      yAxisLabel={yAxisLabel}
      yAxisSuffix=""
      fromZero
      chartConfig={{
        backgroundColor,
        backgroundGradientFrom: backgroundColor,
        backgroundGradientTo: backgroundColor,
        color: () => color,
        labelColor: () => color,
      }}
    />
  );
};

export default BarChart;
