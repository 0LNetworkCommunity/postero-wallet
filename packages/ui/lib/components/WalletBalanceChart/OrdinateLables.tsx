import { View, Text, StyleSheet } from "react-native";
import * as d3 from "d3";
import { useChart } from "./Context";

const LABEL_LINE_HEIGHT = 18;

const styles = StyleSheet.create({
  container: {
    height: "100%",
    overflow: 'hidden',
  },
  labelContainer: {
    position: "absolute",
    left: 0,
  },
  label: {
    color: "#525252",
    fontFamily: "SpaceGrotesk-Regular",
    fontSize: 12,
    lineHeight: LABEL_LINE_HEIGHT,
  },
});

interface Props {
  values: number[];
}

function OrdinateLabels({ values }: Props) {
  const chart = useChart();

  return (
    <View style={styles.container}>
      {values.map((row) => (
        <View
          key={`${row}`}
          style={[
            styles.labelContainer,
            {
              top: chart.yScaler(row) - LABEL_LINE_HEIGHT / 2,
            },
          ]}
        >
          <Text style={styles.label}>{`${d3.format(".2s")(row)}`}</Text>
        </View>
      ))}
    </View>
  );

}

export default OrdinateLabels;
