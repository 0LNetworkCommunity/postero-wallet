"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_svg_1 = require("react-native-svg");
const Context_1 = require("./Context");
function Grid({ values }) {
    const { yScaler, viewPort } = (0, Context_1.useChart)();
    return (<>
      {values.map((row) => (<react_native_svg_1.Line key={`${row}`} x1={0} y1={yScaler(row)} x2={viewPort.width} y2={yScaler(row)} stroke="#D6D6D6" strokeWidth={1}/>))}
    </>);
}
exports.default = Grid;
//# sourceMappingURL=Grid.js.map