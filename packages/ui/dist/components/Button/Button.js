"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Button = exports.ButtonVariation = exports.ButtonSize = void 0;
const react_1 = require("react");
const react_native_1 = require("react-native");
const Text_1 = __importDefault(require("../Text"));
const styles = react_native_1.StyleSheet.create({
    container: {
        borderRadius: 6,
        justifyContent: "center",
        flexDirection: "row",
        shadowColor: "#141414",
        shadowOpacity: 0.05,
        shadowRadius: 1,
        shadowOffset: {
            width: 0,
            height: 1,
        },
    },
    containerHover: {
        backgroundColor: "#292929",
    },
    containerPressed: {
        opacity: 0.8,
    },
    containerPrimary: {
        backgroundColor: "#0F0F0F",
    },
    containerSecondary: {
        backgroundColor: "#F5F5F5",
    },
    textPrimary: {
        color: "#FFFFFF",
    },
    textSecondary: {
        color: "#424242",
    },
    containerMd: {
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    containerXl: {
        paddingVertical: 12,
        paddingHorizontal: 18,
    },
    containerXxl: {
        paddingVertical: 16,
        paddingHorizontal: 22,
    },
    textMd: {
        fontSize: 14,
        lineHeight: 20,
    },
    textXl: {
        fontSize: 16,
        lineHeight: 24,
    },
});
var ButtonSize;
(function (ButtonSize) {
    ButtonSize[ButtonSize["SM"] = 0] = "SM";
    ButtonSize[ButtonSize["MD"] = 1] = "MD";
    ButtonSize[ButtonSize["XL"] = 2] = "XL";
    ButtonSize[ButtonSize["XXL"] = 3] = "XXL";
})(ButtonSize || (exports.ButtonSize = ButtonSize = {}));
var ButtonVariation;
(function (ButtonVariation) {
    ButtonVariation[ButtonVariation["Primary"] = 0] = "Primary";
    ButtonVariation[ButtonVariation["Secondary"] = 1] = "Secondary";
})(ButtonVariation || (exports.ButtonVariation = ButtonVariation = {}));
const containerVariationsStyles = new Map([
    [ButtonVariation.Primary, styles.containerPrimary],
    [ButtonVariation.Secondary, styles.containerSecondary],
]);
const containerSizeStyles = new Map([
    [ButtonSize.MD, styles.containerMd],
    [ButtonSize.XL, styles.containerXl],
    [ButtonSize.XXL, styles.containerXxl],
]);
const textVariationsStyles = new Map([
    [ButtonVariation.Primary, styles.textPrimary],
    [ButtonVariation.Secondary, styles.textSecondary],
]);
function Button({ title, size = ButtonSize.MD, variation = ButtonVariation.Primary, style, onPress, }) {
    const [hovered, setHovered] = (0, react_1.useState)(false);
    const [pressed, setPressed] = (0, react_1.useState)(false);
    return (<react_native_1.Pressable style={[
            styles.container,
            containerSizeStyles.get(size),
            containerVariationsStyles.get(variation),
            hovered && styles.containerHover,
            pressed && styles.containerPressed,
            style,
        ]} onPress={onPress} onHoverIn={() => setHovered(true)} onHoverOut={() => setHovered(false)} onPressIn={() => setPressed(true)} onPressOut={() => setPressed(false)}>
      <Text_1.default xxl={size === ButtonSize.XXL} style={[textVariationsStyles.get(variation)]}>
        {title}
      </Text_1.default>
    </react_native_1.Pressable>);
}
exports.Button = Button;
//# sourceMappingURL=Button.js.map