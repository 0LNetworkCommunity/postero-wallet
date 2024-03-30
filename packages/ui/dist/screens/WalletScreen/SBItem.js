"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SBItem = void 0;
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const react_native_gesture_handler_1 = require("react-native-gesture-handler");
const react_native_reanimated_1 = __importDefault(require("react-native-reanimated"));
const WalletCard_1 = __importDefault(require("./WalletCard"));
const styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 6,
    },
});
const SBItem = (props) => {
    const { style, index, testID, onPress, ...animatedViewProps } = props;
    return (<react_native_gesture_handler_1.LongPressGestureHandler>
      <react_native_reanimated_1.default.View style={{ flex: 1 }} {...animatedViewProps}>
        <react_native_1.View style={styles.container}>
          <react_native_gesture_handler_1.TouchableWithoutFeedback style={{
            width: "100%",
            height: "100%",
        }} onPress={onPress}>
            <WalletCard_1.default />
          </react_native_gesture_handler_1.TouchableWithoutFeedback>
        </react_native_1.View>
      </react_native_reanimated_1.default.View>
    </react_native_gesture_handler_1.LongPressGestureHandler>);
};
exports.SBItem = SBItem;
//# sourceMappingURL=SBItem.js.map