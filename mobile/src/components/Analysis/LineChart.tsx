import * as scale from "d3-scale";
import { useState } from "react";
import { View } from "react-native";
import { Circle, Line } from "react-native-svg";
import {
  LineChart as LineChartSVG,
  XAxis,
  YAxis,
} from "react-native-svg-charts";
import { COLOR_PALETTE, SCREEN_WIDTH } from "@/constants";
import { useThemeStore } from "@/store/themStore";
import { NAV_THEME } from "@/lib/theme";
import { useAuthStore } from "@/store";

type Props = {
  data: {
    labels: string[];
    datasets: {
      data: number[];
    }[];
  };
  yAxisLabel: string;
  color: string;
};

const LineChart = ({ data, color, yAxisLabel }: Props) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const { isDark } = useThemeStore();
  const { user } = useAuthStore();

  const lineData = data.datasets[0].data;
  const DotDecorator = ({
    x,
    y,
    data,
  }: {
    x?: (index: number) => number;
    y?: (value: number) => number;
    data?: number[];
  }) => {
    return data?.map((value: number, index: number) => (
      <Circle
        key={`dot-${index}`}
        cx={x ? x(index) : 0}
        cy={y ? y(value) : 0}
        r={3}
        stroke={color}
        fill={
          isDark
            ? NAV_THEME.dark.colors.background
            : NAV_THEME.light.colors.background
        }
        strokeWidth={2}
        onPress={() => setSelectedIndex(index)}
      />
    ));
  };

  const VerticalLine = ({ x, y }: any) => {
    if (selectedIndex === null) return null;

    return (
      <>
        <Line
          x1={x(selectedIndex)}
          x2={x(selectedIndex)}
          y1={y(Math.max(...lineData))}
          y2={y(Math.min(...lineData))}
          strokeWidth={1}
          stroke={COLOR_PALETTE[4]}
        />
        <Line
          y1={y(lineData[selectedIndex])}
          y2={y(lineData[selectedIndex])}
          x1={"0%"}
          x2={"100%"}
          strokeWidth={1}
          stroke={COLOR_PALETTE[4]}
        />
      </>
    );
  };

  const HorizontalLines = ({ y }: any) => {
    const ticks = [...new Set(lineData)]; // Or use fixed values like [0, 20, 40, 60]
    return ticks.map((value, index) => (
      <Line
        key={`h-line-${index}`}
        x1={0}
        x2="100%"
        y1={y(value)}
        y2={y(value)}
        stroke={NAV_THEME.dark.colors.border + "50"}
        strokeWidth={1}
      />
    ));
  };

  return (
    <View
      style={{
        height: 250,
        width: SCREEN_WIDTH - 60,
        alignItems: "center",
        padding: 10,
      }}
    >
      <View style={{ flexDirection: "row", flex: 1 }}>
        {/* Y Axis */}
        <YAxis
          data={lineData}
          contentInset={{ top: 20, bottom: 30 }}
          svg={{ fontSize: 12, fill: NAV_THEME.dark.colors.card }}
          numberOfTicks={5}
          formatLabel={(value) =>
            `${user?.currency?.symbol || yAxisLabel}${value}`
          }
        />

        {/* Chart Area */}

        <View style={{ flex: 1 }}>
          {/* Line Chart */}
          <LineChartSVG
            style={{ flex: 1 }}
            data={lineData}
            svg={{ stroke: color, strokeWidth: 2 }}
            contentInset={{ top: 20, bottom: 20, left: 10, right: 20 }}
            yAccessor={({ item }) => item}
            xAccessor={({ index }) => index}
            yScale={scale.scaleLinear}
            xScale={scale.scaleLinear}
          >
            <HorizontalLines />
            <VerticalLine />
            <DotDecorator />
          </LineChartSVG>

          {/* X Axis */}
          <XAxis
            data={lineData}
            formatLabel={(_, index) => data.labels[index] || ""}
            contentInset={{ left: 15, right: 10 }}
            svg={{ fontSize: 12, fill: NAV_THEME.dark.colors.card }}
            scale={scale.scaleBand}
            xAccessor={({ index }) => index}
          />
        </View>
      </View>
    </View>
  );
};

export default LineChart;
