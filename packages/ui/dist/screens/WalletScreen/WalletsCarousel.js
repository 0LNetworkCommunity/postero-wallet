"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Slider_1 = __importDefault(require("./Slider"));
function Wrapper() {
    const [rect, setRect] = (0, react_1.useState)();
    const onLayout = (event) => {
        setRect(event.nativeEvent.layout);
    };
    return (<react_native_1.View style={{ flex: 1 }} onLayout={onLayout}>
      {rect && <Slider_1.default width={rect.width} height={rect.height}/>}
    </react_native_1.View>);
}
exports.default = Wrapper;
//# sourceMappingURL=WalletsCarousel.js.map