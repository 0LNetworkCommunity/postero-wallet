import { createContext, useContext } from "react";
import { LayoutRectangle } from "react-native";
import * as d3 from "d3";

interface ChartContext {
  width: number;
  height: number;
  xExtent: [number, number];
  yExtent: [number, number];
  yScaler: d3.ScaleLinear<number, number, never>;
  xScaler: d3.ScaleTime<number, number, never>;
  viewPort: LayoutRectangle;
}

export const Context = createContext<ChartContext>(null as never);

export function useChart() {
  return useContext(Context);
}
