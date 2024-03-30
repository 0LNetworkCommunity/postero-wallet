"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlowWalletRatio = void 0;
const react_native_1 = require("react-native");
const UnlockedIcon_1 = __importDefault(require("../../icons/UnlockedIcon"));
const LockedIcon_1 = __importDefault(require("../../icons/LockedIcon"));
const styles = react_native_1.StyleSheet.create({
    container: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
    },
    barsContainer: {
        flex: 1,
        paddingHorizontal: 4,
        paddingVertical: 6,
        flexDirection: "row",
    },
    bar: {
        borderRadius: 4,
        flex: 1,
    },
});
function SlowWalletRatio({ locked, unlocked }) {
    const total = (locked ?? 0) + unlocked;
    return (<react_native_1.View style={styles.container}>
      <UnlockedIcon_1.default />
      <react_native_1.View style={styles.barsContainer}>
        {unlocked > 0 && (<react_native_1.View style={{
                width: `${(unlocked / total) * 100}%`,
                paddingRight: locked !== undefined ? 1 : 0,
            }}>
            <react_native_1.View style={[styles.bar, { backgroundColor: "#CD3B42" }]}/>
          </react_native_1.View>)}
        {locked !== undefined && (<react_native_1.View style={{
                width: `${(locked / total) * 100}%`,
                paddingLeft: unlocked > 0 ? 1 : 0,
            }}>
            <react_native_1.View style={[styles.bar, { backgroundColor: "#E5E5E5" }]}/>
          </react_native_1.View>)}
      </react_native_1.View>
      <LockedIcon_1.default />
    </react_native_1.View>);
}
exports.SlowWalletRatio = SlowWalletRatio;
//# sourceMappingURL=SlowWalletRatio.js.map