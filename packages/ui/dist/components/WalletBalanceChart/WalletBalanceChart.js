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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_svg_1 = __importStar(require("react-native-svg"));
const d3 = __importStar(require("d3"));
const Context_1 = require("./Context");
const OrdinateLables_1 = __importDefault(require("./OrdinateLables"));
const Abscissa_1 = __importDefault(require("./Abscissa"));
const contants_1 = require("./contants");
const Grid_1 = __importDefault(require("./Grid"));
function BaseChart({ width, height, data, }) {
    console.log("data", data);
    const viewPort = {
        x: contants_1.ORDINATE_WIDTH,
        y: 0,
        width: width - contants_1.ORDINATE_WIDTH,
        height: height - contants_1.ABSCISSA_HEIGHT,
    };
    const xExt = d3.extent(data, (it) => it.date.getTime());
    const yExt = d3.extent(data, (it) => it.value);
    yExt[1] = yExt[1] + yExt[1] * 0.001;
    const xScaler = d3.scaleUtc(xExt, [0, viewPort.width]);
    const yScaler = d3.scaleLinear(yExt, [viewPort.height, 0]);
    const line = d3
        .line()
        .x((d) => xScaler(d.date.getTime()))
        .y((d) => yScaler(d.value));
    const area = d3
        .area()
        .x((d) => xScaler(d.date.getTime()))
        .y0(yScaler(0))
        .y1((d) => yScaler(d.value));
    const yRange = yExt[1] - yExt[0];
    const rows = [];
    for (let i = 0; i <= 5; ++i) {
        rows.push(yExt[0] + (i * yRange * 1) / 5);
    }
    const lineD = line(data);
    const areaD = area(data);
    return (<Context_1.Context.Provider value={{
            width,
            height,
            yExtent: yExt,
            xExtent: xExt,
            yScaler,
            xScaler,
            viewPort,
        }}>
      <react_native_1.View style={{ width, height, flexDirection: "row" }}>
        <react_native_1.View style={{ width: contants_1.ORDINATE_WIDTH, height: "100%" }}>
          <OrdinateLables_1.default values={rows}/>
        </react_native_1.View>

        <react_native_1.View style={{ height: "100%", flexGrow: 1, flexDirection: "column" }}>
          <react_native_1.View style={{ flexGrow: 1 }}>
            <react_native_svg_1.default width={viewPort.width} height={viewPort.height} viewBox={`0 0 ${viewPort.width} ${viewPort.height}`}>
              <react_native_svg_1.Defs>
                <react_native_svg_1.LinearGradient id="grad-1" x1={0} y1={0} x2={0} y2={height} gradientUnits="userSpaceOnUse">
                  <react_native_svg_1.Stop offset="0" stopColor="#CD3B42" stopOpacity="0.5"/>
                  <react_native_svg_1.Stop offset="1" stopColor="#CD3B42" stopOpacity="0.01"/>
                </react_native_svg_1.LinearGradient>
              </react_native_svg_1.Defs>

              <Grid_1.default values={rows}/>

              <react_native_svg_1.Path fill="none" stroke="#CD3B42" strokeWidth={2} d={lineD || ""}/>

              <react_native_svg_1.Path d={areaD || ""} fill="url(#grad-1)"/>
            </react_native_svg_1.default>
          </react_native_1.View>
          <react_native_1.View style={{ height: 16 }}>
            <Abscissa_1.default />
          </react_native_1.View>
        </react_native_1.View>
      </react_native_1.View>
    </Context_1.Context.Provider>);
}
function WalletBalanceChart({ data }) {
    const [layoutRectangle, setLayoutRectangle] = (0, react_1.useState)();
    const onLayout = (event) => {
        const { layout } = event.nativeEvent;
        if (!layoutRectangle ||
            layoutRectangle.width !== layout.width ||
            layoutRectangle.height !== layout.height) {
            setLayoutRectangle({
                width: layout.width - 20,
                height: layout.height - 20,
            });
        }
    };
    return (<react_native_1.View onLayout={onLayout} style={{
            padding: 10,
            width: "100%",
            height: "100%",
            backgroundColor: "white",
        }}>
      {layoutRectangle && (<react_native_1.View style={{
                width: layoutRectangle?.width,
                height: layoutRectangle?.height,
            }}>
          <BaseChart width={layoutRectangle.width} height={layoutRectangle.height} data={data}/>
        </react_native_1.View>)}
    </react_native_1.View>);
}
exports.default = WalletBalanceChart;
//# sourceMappingURL=WalletBalanceChart.js.map