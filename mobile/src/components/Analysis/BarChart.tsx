import { View } from "react-native";
import {
  BarChart as BarChartSVG,
  Grid,
  YAxis,
  XAxis,
  SvgData,
} from "react-native-svg-charts";
import * as scale from "d3-scale";

type Props = {
  fill: string;
  data: SvgData[][];
  labels?: string[];
};

const BarChart = ({ data, fill, labels }: Props) => {
  // Flatten the data for BarChartSVG
  const flatData = data.flat();
  const values = flatData.map((item) => item.value);

  return (
    <View style={{ height: 250, padding: 10 }}>
      <View style={{ flexDirection: "row", flex: 1 }}>
        {/* Y Axis */}
        <YAxis
          data={values}
          contentInset={{ top: 30, bottom: 10 }}
          svg={{
            fontSize: 12,
            fill: "#888",
          }}
          numberOfTicks={5}
          formatLabel={(value) => `${value}`}
        />

        <View style={{ flex: 1, marginLeft: 10 }}>
          {/* Grouped Bar Chart */}
          <BarChartSVG
            style={{ flex: 1 }}
            data={flatData}
            yAccessor={({ item }) => item.value}
            spacingInner={0.4}
            spacingOuter={0.4}
            contentInset={{ top: 30, bottom: 10 }}
            grid={1}
            svg={{
              fill,
            }}
          >
            <Grid />
          </BarChartSVG>

          {/* X Axis */}
          <XAxis
            style={{ marginTop: 10 }}
            data={labels ?? []}
            formatLabel={(_, index) => (labels ? labels[index] : "")}
            scale={scale.scaleBand}
            contentInset={{ left: 20, right: 20 }}
            svg={{ fontSize: 12, fill: "#888" }}
          />
        </View>
      </View>
    </View>
  );
};

export default BarChart;
