"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
const d3 = __importStar(require("d3"));
const Context_1 = require("./Context");
const LABEL_LINE_HEIGHT = 18;
const styles = react_native_1.StyleSheet.create({
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
function OrdinateLabels({ values }) {
    const chart = (0, Context_1.useChart)();
    return (<react_native_1.View style={styles.container}>
      {values.map((row) => (<react_native_1.View key={`${row}`} style={[
                styles.labelContainer,
                {
                    top: chart.yScaler(row) - LABEL_LINE_HEIGHT / 2,
                },
            ]}>
          <react_native_1.Text style={styles.label}>{`${d3.format(".2s")(row)}`}</react_native_1.Text>
        </react_native_1.View>))}
    </react_native_1.View>);
}
exports.default = OrdinateLabels;
//# sourceMappingURL=OrdinateLables.js.map