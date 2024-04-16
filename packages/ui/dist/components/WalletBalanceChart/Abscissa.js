"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
const d3_time_format_1 = require("d3-time-format");
const Context_1 = require("./Context");
const contants_1 = require("./contants");
const styles = react_native_1.StyleSheet.create({
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
        lineHeight: contants_1.ABSCISSA_HEIGHT,
    },
});
const formatTime = (0, d3_time_format_1.timeFormat)("%d/%m");
function Abscissa() {
    const { xScaler } = (0, Context_1.useChart)();
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
    return (<react_native_1.View style={styles.container}>
      {ticks.map((tick) => (<react_native_1.View key={tick.x} style={[styles.tickContainer, { left: tick.x - 20 }]}>
          <react_native_1.Text style={styles.tickLabel}>{tick.value}</react_native_1.Text>
        </react_native_1.View>))}
    </react_native_1.View>);
}
exports.default = Abscissa;
//# sourceMappingURL=Abscissa.js.map