import { FC, useState } from 'react';
import { LayoutChangeEvent, LayoutRectangle, View, Text } from 'react-native';
import Svg, { Circle, Rect, Path, Line, Defs, LinearGradient, Stop, Ellipse, RadialGradient, ClipPath } from 'react-native-svg';
import * as d3 from "d3";

interface Props {
  data: {
    date: Date;
    value: number;
  }[];
}

const BaseChart: FC<{ width: number; height: number } & Props> = ({
  width,
  height,
  data,
}) => {
  console.log("data", data);

  const rightMargin = 50;

  const xExt = d3.extent(data, (it) => it.date.getTime()) as [number, number]

  const yExt = d3.extent(data, (it) => it.value) as [number, number]
  yExt[1] = yExt[1] + yExt[1] * 0.001;

  console.log('xExt', xExt, yExt[0], yExt[1]);

  const x = d3.scaleUtc(xExt, [0, width - rightMargin]);

  console.log("yExt", yExt);
  // Declare the y (vertical position) scale.
  const y = d3.scaleLinear(yExt, [height, 0]);

  // Declare the line generator.
  const line = d3
    .line<{ date: Date; value: number }>()
    .x((d) =>  x(d.date.getTime()))
    .y((d) => y(d.value));

  const area = d3.area<{ date: Date; value: number }>()
    .x(d => x(d.date.getTime()))
    .y0(y(0))
    .y1(d => y(d.value));

  const yRange = yExt[1] - yExt[0];

  const rows: number[] = [];

  for (let i = 0; i <= 5; ++i) {
    rows.push(yExt[0] + i * yRange * 1/5);
  }

  const lineD = line(data);
  const areaD = area(data);

  const xx = d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0);

  return (
    <View style={{ width, height }}>
      {rows.map((row) => (
        <View
          key={`${row}`}
          style={{
            position: "absolute",
            left: width - rightMargin,
            top: y(row) - 6,
          }}
        >
          <Text style={{ fontSize: 12, lineHeight: 12 }}>{`${row}`}</Text>
        </View>
      ))}

      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <Defs>
          <LinearGradient
            id="grad-1"
            x1={0}
            y1={0}
            x2={0}
            y2={height}
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0" stopColor="#4581B4" stopOpacity="0.5" />
            <Stop offset="1" stopColor="#4581B4" stopOpacity="0.01" />
          </LinearGradient>
        </Defs>


        <Path
          fill="none"
          stroke="steelblue"
          strokeWidth={1.5}
          d={lineD || ""}
        />

        <Path d={areaD || ""} fill="url(#grad-1)" />

        {rows.map((row) => (
          <Line
            key={`${row}`}
            x1={0}
            y1={y(row)}
            x2={width - rightMargin}
            y2={y(row)}
            stroke="#1b1e23"
            strokeOpacity="0.1"
            strokeWidth={.5}
          />
        ))}

        {/* <Circle
        cx="50"
        cy="50"
        r="45"
        stroke="blue"
        strokeWidth="2.5"
        fill="green"
      />
      <Rect
        x="15"
        y="15"
        width="70"
        height="70"
        stroke="red"
        strokeWidth="2"
        fill="yellow"
      /> */}
      </Svg>
    </View>
  );
};

const Chart: FC<Props> = ({ data }) => {
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
};

export default Chart;
