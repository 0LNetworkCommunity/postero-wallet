"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Default = void 0;
const react_native_1 = require("react-native");
const UnlockedIcon_1 = __importDefault(require("./UnlockedIcon"));
const LockedIcon_1 = __importDefault(require("./LockedIcon"));
const EyeIcon_1 = __importDefault(require("./EyeIcon"));
const EyeOffIcon_1 = __importDefault(require("./EyeOffIcon"));
const QrScanIcon_1 = __importDefault(require("./QrScanIcon"));
const SwitchVerticalIcon_1 = __importDefault(require("./SwitchVerticalIcon"));
function IconsStory() {
    const color = "#525252";
    const size = 32;
    return (<react_native_1.View>
      <UnlockedIcon_1.default size={size} color={color}/>
      <LockedIcon_1.default size={size} color={color}/>
      <EyeIcon_1.default size={size} color={color}/>
      <EyeOffIcon_1.default size={size} color={color}/>
      <QrScanIcon_1.default size={size} color={color}/>
      <SwitchVerticalIcon_1.default size={size} color={color}/>
    </react_native_1.View>);
}
exports.default = {
    title: "icons",
    component: IconsStory,
};
exports.Default = {};
//# sourceMappingURL=Icons.stories.js.map