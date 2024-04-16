import { StyleSheet, Text, View } from "react-native";
import { timeFormat } from "d3-time-format";
import { useChart } from "./Context";
import { ABSCISSA_HEIGHT } from "./contants";

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
    height: '100%',
  },
  tickContainer: {
    position: "absolute",
    width: 40,
  },
  tickLabel: {
    color: "#525252",
    textAlign: "center",
    fontFamily: "SpaceGrotesk-Regular",
    fontSize: 12,
    lineHeight: ABSCISSA_HEIGHT,
  },
});

const formatTime = timeFormat("%d/%m");

function Abscissa() {
  const { xScaler } = useChart();

  const [start, end] = xScaler.range();
  const tickSize = 60;

  const total = Math.ceil((end - start) / tickSize);

  const ticks = Array.from({ length: total }).map((_, i) => {
    const x = i * tickSize;
    return {
      value: formatTime(xScaler.invert(x)),
      x
    };
  });
  return (
    <View style={styles.container}>
      {ticks.map((tick) => (
        <View key={tick.x} style={[styles.tickContainer, { left: tick.x - 20 }]}>
          <Text style={styles.tickLabel}>{tick.value}</Text>
        </View>
      ))}
    </View>
  );
}

export default Abscissa;
