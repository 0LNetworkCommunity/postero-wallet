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
const React = __importStar(require("react"));
const react_native_1 = require("react-native");
const react_native_reanimated_carousel_1 = __importDefault(require("react-native-reanimated-carousel"));
const react_native_reanimated_1 = __importStar(require("react-native-reanimated"));
const SBItem_1 = require("./SBItem");
function Index({ width, height }) {
    const scrollOffsetValue = (0, react_native_reanimated_1.useSharedValue)(0);
    const data = [...new Array(4).keys()];
    const ref = React.useRef(null);
    const progressValue = (0, react_native_reanimated_1.useSharedValue)(0);
    return (<>
      <react_native_reanimated_carousel_1.default style={{
            width,
            height: height - 10,
            justifyContent: "center",
        }} width={width - 40} height={height - 20} loop={data.length > 2} ref={ref} defaultScrollOffsetValue={scrollOffsetValue} data={data} onScrollEnd={() => {
            console.log("===2");
        }} pagingEnabled={true} onSnapToItem={(index) => console.log("current index:", index)} renderItem={({ index }) => {
            return (<SBItem_1.SBItem index={index} onPress={() => {
                    if (!ref.current) {
                        return;
                    }
                    const currentIndex = ref.current?.getCurrentIndex();
                    if (currentIndex === 0 && index === data.length - 1) {
                        ref.current.prev();
                        return;
                    }
                    if (currentIndex === data.length - 1 && index === 0) {
                        ref.current.next();
                        return;
                    }
                    if (index === currentIndex + 1) {
                        ref.current.next();
                        return;
                    }
                    if (index === currentIndex - 1) {
                        ref.current.prev();
                        return;
                    }
                    ref.current?.scrollTo({ index, animated: true });
                }}/>);
        }} onProgressChange={(_, absoluteProgress) => (progressValue.value = absoluteProgress)}/>

      {!!progressValue && (<react_native_1.View style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignSelf: "center",
            }}>
          {data.map((_, index) => {
                return (<PaginationItem animValue={progressValue} index={index} key={index} length={data.length}/>);
            })}
        </react_native_1.View>)}
    </>);
}
const PaginationItem = (props) => {
    const { animValue, index, length } = props;
    const width = 10;
    const animStyle = (0, react_native_reanimated_1.useAnimatedStyle)(() => {
        return {
            width: (0, react_native_reanimated_1.interpolate)(animValue?.value, index === 0 && animValue?.value > length - 1
                ? [length - 1, length, length + 1]
                : [index - 1, index, index + 1], [width, width + 10, width], react_native_reanimated_1.Extrapolation.CLAMP),
            opacity: (0, react_native_reanimated_1.interpolate)(animValue?.value, index === 0 && animValue?.value > length - 1
                ? [length - 1, length, length + 1]
                : [index - 1, index, index + 1], [0.17, 1, 0.17], react_native_reanimated_1.Extrapolation.CLAMP),
        };
    }, [animValue, index, length]);
    return (<react_native_reanimated_1.default.View style={[
            {
                backgroundColor: "#141414",
                height: 10,
                borderRadius: 10,
                marginHorizontal: 4,
            },
            animStyle,
        ]}/>);
};
exports.default = Index;
//# sourceMappingURL=Slider.js.map