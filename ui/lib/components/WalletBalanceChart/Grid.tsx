import { Line } from "react-native-svg";
import { useChart } from "./Context";

interface Props {
  values: number[];
}

function Grid({ values }: Props) {
  const { yScaler, viewPort } = useChart();

  return (
    <>
      {values.map((row) => (
        <Line
          key={`${row}`}
          x1={0}
          y1={yScaler(row)}
          x2={viewPort.width}
          y2={yScaler(row)}
          stroke="#D6D6D6"
          strokeWidth={1}
        />
      ))}
    </>
  );
}

export default Grid;
