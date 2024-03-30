"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Default = void 0;
const react_native_1 = require("react-native");
const SlowWalletRatio_1 = __importDefault(require("./SlowWalletRatio"));
const styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        width: "50%",
    },
});
function SlowWalletRatioStory() {
    const color = "#525252";
    const size = 32;
    return (<react_native_1.View style={styles.container}>
      <SlowWalletRatio_1.default unlocked={50_000} locked={100_000}/>
    </react_native_1.View>);
}
exports.default = {
    title: "SlowWalletRatio",
    component: SlowWalletRatioStory,
};
exports.Default = {};
//# sourceMappingURL=SlowWalletRatio.stories.js.map