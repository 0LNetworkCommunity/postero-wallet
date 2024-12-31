import { useState } from "react";
import { View, LayoutChangeEvent, LayoutRectangle } from "react-native";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";
import * as d3 from "d3";

import { Context } from "./Context";
import OrdinateLabels from "./OrdinateLables";
import Abscissa from "./Abscissa";
import { ABSCISSA_HEIGHT, ORDINATE_WIDTH } from "./contants";
import Grid from "./Grid";

interface Props {
  data: {
    date: Date;
    value: number;
  }[];
}

function BaseChart({
  width,
  height,
  data,
}: { width: number; height: number } & Props) {
  console.log("data", data);

  const viewPort: LayoutRectangle = {
    x: ORDINATE_WIDTH,
    y: 0,
    width: width - ORDINATE_WIDTH,
    height: height - ABSCISSA_HEIGHT,
  };

  const xExt = d3.extent(data, (it) => it.date.getTime()) as [number, number];

  const yExt = d3.extent(data, (it) => it.value) as [number, number];
  yExt[1] = yExt[1] + yExt[1] * 0.001;

  const xScaler = d3.scaleUtc(xExt, [0, viewPort.width]);

  // Declare the y (vertical position) scale.
  const yScaler = d3.scaleLinear(yExt, [viewPort.height, 0]);

  // Declare the line generator.
  const line = d3
    .line<{ date: Date; value: number }>()
    .x((d) => xScaler(d.date.getTime()))
    .y((d) => yScaler(d.value));

  const area = d3
    .area<{ date: Date; value: number }>()
    .x((d) => xScaler(d.date.getTime()))
    .y0(yScaler(0))
    .y1((d) => yScaler(d.value));

  const yRange = yExt[1] - yExt[0];

  const rows: number[] = [];

  for (let i = 0; i <= 5; ++i) {
    rows.push(yExt[0] + (i * yRange * 1) / 5);
  }

  const lineD = line(data);
  const areaD = area(data);

  return (
    <Context.Provider
      value={{
        width,
        height,
        yExtent: yExt,
        xExtent: xExt,
        yScaler,
        xScaler,
        viewPort,
      }}
    >
      <View style={{ width, height, flexDirection: "row" }}>
        <View style={{ width: ORDINATE_WIDTH, height: "100%" }}>
          <OrdinateLabels values={rows} />
        </View>

        <View style={{ height: "100%", flexGrow: 1, flexDirection: "column" }}>
          <View style={{ flexGrow: 1 }}>
            <Svg
              width={viewPort.width}
              height={viewPort.height}
              viewBox={`0 0 ${viewPort.width} ${viewPort.height}`}
            >
              <Defs>
                <LinearGradient
                  id="grad-1"
                  x1={0}
                  y1={0}
                  x2={0}
                  y2={height}
                  gradientUnits="userSpaceOnUse"
                >
                  <Stop offset="0" stopColor="#CD3B42" stopOpacity="0.5" />
                  <Stop offset="1" stopColor="#CD3B42" stopOpacity="0.01" />
                </LinearGradient>
              </Defs>

              <Grid values={rows} />

              <Path
                fill="none"
                stroke="#CD3B42"
                strokeWidth={2}
                d={lineD || ""}
              />

              <Path d={areaD || ""} fill="url(#grad-1)" />
            </Svg>
          </View>
          <View style={{ height: 16 }}>
            <Abscissa />
          </View>
        </View>
      </View>
    </Context.Provider>
  );
}

function WalletBalanceChart({ data }: Props) {
  const [layoutRectangle, setLayoutRectangle] = useState<{
    width: number;
    height: number;
  }>();

  const onLayout = (event: LayoutChangeEvent) => {
    const { layout } = event.nativeEvent;
    if (
      !layoutRectangle ||
      layoutRectangle.width !== layout.width ||
      layoutRectangle.height !== layout.height
    ) {
      setLayoutRectangle({
        width: layout.width - 20,
        height: layout.height - 20,
      });
    }
  };

  return (
    <View
      onLayout={onLayout}
      style={{
        padding: 10,
        width: "100%",
        height: "100%",
        backgroundColor: "white",
      }}
    >
      {layoutRectangle && (
        <View
          style={{
            width: layoutRectangle?.width,
            height: layoutRectangle?.height,
          }}
        >
          <BaseChart
            width={layoutRectangle.width}
            height={layoutRectangle.height}
            data={data}
          />
        </View>
      )}
    </View>
  );
}

export default WalletBalanceChart;
