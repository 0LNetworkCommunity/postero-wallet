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
exports.Logo = void 0;
const react_native_1 = require("react-native");
const react_native_svg_1 = __importStar(require("react-native-svg"));
function Logo() {
    return (<react_native_1.View>
      <react_native_svg_1.default width="48" height="48" viewBox="0 0 48 48" fill="none">
        <react_native_svg_1.Path fillRule="evenodd" clipRule="evenodd" d="M22.0347 3.5732C20.5972 3.70625 19.2026 3.98764 17.866 4.402L22.0347 15.9603V3.5732ZM14.866 5.47891C13.1342 6.33335 11.5395 7.42524 10.1241 8.71231L19.4144 18.1042L14.866 5.47891ZM7.87609 11.0769C6.94626 12.2541 6.14054 13.5355 5.47891 14.9011L16.3176 19.6526L7.87609 11.0769ZM4.33839 17.9851C3.83893 19.6155 3.535 21.3319 3.45409 23.1067H16.0794L4.33839 17.9851ZM3.33499 25.9653C3.47915 27.4898 3.79743 28.9653 4.27028 30.3722L15.4839 25.9653H3.33499ZM5.71712 33.5447C6.51979 35.0714 7.50972 36.4855 8.65662 37.7568L16.9132 29.062L5.71712 33.5447ZM11.0769 40.1184C12.1051 40.9413 13.2139 41.6674 14.3895 42.2829L18.4615 32.2779L11.0769 40.1184ZM17.5087 43.5918C18.9525 44.0753 20.4678 44.4002 22.0347 44.5459V32.397L17.5087 43.5918ZM25.0124 44.665C35.9506 44.1638 44.665 35.1302 44.665 24.0596C44.665 12.9889 35.9506 3.95528 25.0124 3.45409V23.6573V23.851V23.8512V25.5427V44.665ZM24.0001 0C10.7452 0 0 10.7452 0 24.0001C0 37.2549 10.7452 48 24.0001 48C37.2549 48 48 37.2549 48 24.0001C48 10.7452 37.2549 0 24.0001 0Z" fill="#CD3B42"/>
      </react_native_svg_1.default>
    </react_native_1.View>);
}
exports.Logo = Logo;
//# sourceMappingURL=Logo.js.map