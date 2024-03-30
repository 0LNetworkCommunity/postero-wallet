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
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const react_native_gesture_handler_1 = require("react-native-gesture-handler");
const LockedIcon_1 = __importDefault(require("../../icons/LockedIcon"));
const AnimatedIcon = react_native_1.Animated.createAnimatedComponent(LockedIcon_1.default);
class GmailStyleSwipeableRow extends react_1.Component {
    constructor() {
        super(...arguments);
        this.renderLeftActions = (progress, dragX) => {
            const scale = dragX.interpolate({
                inputRange: [0, 80],
                outputRange: [0, 1],
                extrapolate: 'clamp',
            });
            return (<react_native_gesture_handler_1.RectButton style={styles.leftAction} onPress={this.close}>
        <AnimatedIcon name="archive" size={30} color="#fff" style={[styles.actionIcon]}/>
      </react_native_gesture_handler_1.RectButton>);
        };
        this.renderRightActions = (progress, dragX) => {
            const scale = dragX.interpolate({
                inputRange: [-80, 0],
                outputRange: [1, 0],
                extrapolate: 'clamp',
            });
            return (<react_native_gesture_handler_1.RectButton style={styles.rightAction} onPress={this.close}>
        <AnimatedIcon name="delete-forever" size={30} color="#fff" style={[styles.actionIcon]}/>
      </react_native_gesture_handler_1.RectButton>);
        };
        this.updateRef = ref => {
            this._swipeableRow = ref;
        };
        this.close = () => {
            this._swipeableRow.close();
        };
    }
    render() {
        const { children } = this.props;
        return (<react_native_gesture_handler_1.Swipeable ref={this.updateRef} friction={2} leftThreshold={80} rightThreshold={41} renderLeftActions={this.renderLeftActions} renderRightActions={this.renderRightActions}>
        {children}
      </react_native_gesture_handler_1.Swipeable>);
    }
}
exports.default = GmailStyleSwipeableRow;
const styles = react_native_1.StyleSheet.create({
    leftAction: {
        flex: 1,
        backgroundColor: '#388e3c',
        justifyContent: 'flex-end',
        alignItems: 'center',
        flexDirection: react_native_1.I18nManager.isRTL ? 'row' : 'row-reverse'
    },
    actionIcon: {
        width: 30,
        marginHorizontal: 10
    },
    rightAction: {
        alignItems: 'center',
        flexDirection: react_native_1.I18nManager.isRTL ? 'row-reverse' : 'row',
        backgroundColor: '#dd2c00',
        flex: 1,
        justifyContent: 'flex-end'
    }
});
//# sourceMappingURL=GmailStyleSwipeableRow.js.map