declare module 'react-native-sqlite-storage' {
  interface SQLiteDatabase {
    executeSql(sql: string, params?: any[]): Promise<[SQLResultSet]>;
    transaction(fn: (tx: SQLTransaction) => void): Promise<void>;
    close(): Promise<void>;
  }

  interface SQLResultSet {
    rows: {
      length: number;
      item(index: number): any;
      raw(): any[];
    };
  }

  interface SQLTransaction {
    executeSql(sql: string, params?: any[]): Promise<[SQLResultSet]>;
  }

  export function openDatabase(
    config: { name: string; location?: string },
  ): Promise<SQLiteDatabase>;

  export function enablePromise(enable: boolean): void;
}

declare module 'react-native-chart-kit' {
  import { ViewStyle } from 'react-native';
  export interface ChartConfig {
    backgroundColor?: string;
    backgroundGradientFrom?: string;
    backgroundGradientTo?: string;
    color?: (opacity?: number) => string;
    labelColor?: (opacity?: number) => string;
    propsForDots?: any;
    decimalCount?: number;
  }

  export interface LineChartData {
    labels: string[];
    datasets: Array<{
      data: number[];
      color?: (opacity?: number) => string;
      strokeWidth?: number;
    }>;
  }

  export interface BarChartData {
    labels: string[];
    datasets: Array<{
      data: number[];
    }>;
  }

  export class LineChart extends React.Component<{
    data: LineChartData;
    width: number;
    height: number;
    chartConfig: ChartConfig;
    style?: ViewStyle;
    bezier?: boolean;
  }> {}

  export class BarChart extends React.Component<{
    data: BarChartData;
    width: number;
    height: number;
    chartConfig: ChartConfig;
    style?: ViewStyle;
  }> {}
}

declare module 'react-native-markdown-display' {
  import { StyleProp, TextStyle, ViewStyle } from 'react-native';

  interface MarkdownProps {
    children: string;
    style?: {
      body?: StyleProp<TextStyle>;
      heading1?: StyleProp<TextStyle>;
      heading2?: StyleProp<TextStyle>;
      heading3?: StyleProp<TextStyle>;
      paragraph?: StyleProp<TextStyle>;
      link?: StyleProp<TextStyle>;
      list_item?: StyleProp<TextStyle>;
      code_inline?: StyleProp<TextStyle>;
      code_block?: StyleProp<TextStyle>;
      fence?: StyleProp<ViewStyle>;
      blockquote?: StyleProp<ViewStyle>;
    };
  }

  export default class Markdown extends React.Component<MarkdownProps> {}
}
