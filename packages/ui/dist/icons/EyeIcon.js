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
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_svg_1 = __importStar(require("react-native-svg"));
function EyeIcon({ size = 24, color = "#000000" }) {
    return (<react_native_svg_1.default width={size} height={size} viewBox="0 0 24 24">
      <react_native_svg_1.Path d="M11.8441525,4 C16.3607702,4 19.8380722,6.90218179 22.2699973,10.7528955 C22.4179647,10.9872315 22.4661392,11.0691013 22.5297137,11.2140863 C22.5777742,11.3236908 22.6144244,11.4346732 22.6416237,11.5533938 C22.7038621,11.8251969 22.7038621,12.1748031 22.6415981,12.4467181 C22.6144244,12.5653268 22.5777742,12.6763092 22.5297137,12.7859137 C22.4661392,12.9308987 22.4179647,13.0127685 22.2699572,13.247168 C19.838158,17.0977689 16.360784,20 11.8441525,20 C7.32752482,20 3.85021579,17.0978118 1.41836996,13.2471714 C1.27032553,13.012679 1.22220005,12.9308866 1.15863868,12.785945 C1.11058483,12.6763659 1.07393405,12.5654105 1.04675222,12.4468287 C0.984415927,12.1748831 0.984415927,11.8251169 1.04675241,11.5531705 C1.07393405,11.4345895 1.11058483,11.3236341 1.15863868,11.214055 C1.22220005,11.0691134 1.27032553,10.987321 1.41837537,10.75282 C3.85030154,6.90213881 7.32753856,4 11.8441525,4 Z M11.8441525,6 C8.19843165,6 5.21065661,8.49362867 3.10945268,11.8206484 C3.05041295,11.9141634 3.02040266,11.9628922 3.00476599,11.989981 L2.999,11.998 L3.00476599,12.010019 C3.01649349,12.0303356 3.03630616,12.0628247 3.07038691,12.1172511 L3.10937504,12.1792286 C5.21058502,15.5063327 8.19841747,18 11.8441525,18 C15.4898928,18 18.4777829,15.5062942 20.5789077,12.1792955 C20.6379289,12.0858237 20.667936,12.0371053 20.6835684,12.010028 L20.688,12 L20.6835701,11.9899747 C20.6718484,11.9696707 20.6520446,11.9371996 20.6179885,11.8828199 L20.5789532,11.8207766 C18.4777114,8.49366714 15.4898787,6 11.8441525,6 Z" fill={color} fillRule="nonzero"/>
      <react_native_svg_1.Path d="M11.8441525,8 C14.0533372,8 15.8441525,9.79081525 15.8441525,12 C15.8441525,14.2091847 14.0533372,16 11.8441525,16 C9.63496775,16 7.8441525,14.2091847 7.8441525,12 C7.8441525,9.79081525 9.63496775,8 11.8441525,8 Z M11.8441525,10 C10.7395372,10 9.8441525,10.8953847 9.8441525,12 C9.8441525,13.1046153 10.7395372,14 11.8441525,14 C12.9487678,14 13.8441525,13.1046153 13.8441525,12 C13.8441525,10.8953847 12.9487678,10 11.8441525,10 Z" fill={color} fillRule="nonzero"/>
    </react_native_svg_1.default>);
}
exports.default = EyeIcon;
//# sourceMappingURL=EyeIcon.js.map