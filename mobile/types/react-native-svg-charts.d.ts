declare module "react-native-svg-charts" {
  import * as React from "react";
  import { SvgProps } from "react-native-svg";
  import { ViewStyle } from "react-native";

  export interface PieChartProps<T> {
    style?: ViewStyle | ViewStyle[];
    data: T[];
    valueAccessor?: (props: { item: T; index: number }) => number;
    outerRadius?: string | number;
    innerRadius?: string | number;
    children?: React.ReactNode;
  }

  export interface SvgData {
    value: number;
    svg?: Partial<SvgProps>;
    key?: string;
    label?: string;
  }

  export interface GridProps {
    direction?: "horizontal" | "vertical";
    svg?: Partial<SvgProps>;
  }

  export interface BarChartProps<T> {
    style?: ViewStyle | ViewStyle[];
    data: T[] | T[][];
    yAccessor?: (props: { item: T; index: number }) => number;
    svg?: Partial<SvgProps>;
    horizontal?: boolean;
    contentInset?: {
      top?: number;
      bottom?: number;
      left?: number;
      right?: number;
    };
    spacingInner?: number;
    spacingOuter?: number;
    grid?: number;
    children?: React.ReactNode;
  }

  export class LineChart<T> extends React.Component<{
    style?: ViewStyle | ViewStyle[];
    data: T[];
    yAccessor?: (props: { item: T; index: number }) => number;
    xAccessor?: (props: { item: T; index: number }) => number;
    svg?: Partial<SvgProps>;
    contentInset?: {
      top?: number;
      bottom?: number;
      left?: number;
      right?: number;
    };
    yScale?: (value: number) => number;
    xScale?: (value: number) => number;
    numberOfTicks?: number;
    spacingInner?: number;
    spacingOuter?: number;
    showGrid?: boolean;
    yMin?: number;
    yMax?: number;
    xMin?: number;
    xMax?: number;
    animate?: boolean;
    children?: React.ReactNode;
  }> {}

  export class PieChart<T> extends React.Component<PieChartProps<T>> {}
  export class YAxis<T> extends React.Component<{
    data: T[];
    yAccessor?: (props: { item: T; index: number }) => number;
    scale?: (value: number) => number;
    contentInset?: { top?: number; bottom?: number };
    spacing?: number;
    formatLabel?: (value: any, index: number) => string;
    svg?: {
      fontSize?: number;
      fill?: string;
    };
    numberOfTicks?: number;
  }> {}
  export class XAxis<T> extends React.Component<{
    style?: ViewStyle | ViewStyle[];
    svg?: {
      fontSize?: number;
      fill?: string;
    };
    data: T[];
    xAccessor?: (props: { item: T; index: number }) => number;
    scale?: (value: number) => number;
    contentInset?: { left?: number; right?: number };
    spacing?: number;
    formatLabel?: (value: any, index: number) => string;
    numberOfTicks?: number;
  }> {}
  export class Grid extends React.Component<GridProps> {}
  export class BarChart<T> extends React.Component<BarChartProps<T>> {}
}
