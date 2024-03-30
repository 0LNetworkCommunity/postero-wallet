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
const react_1 = require("react");
const react_native_1 = require("react-native");
const expo_font_1 = require("expo-font");
const SplashScreen = __importStar(require("expo-splash-screen"));
const react_native_gesture_handler_1 = require("react-native-gesture-handler");
const _storybook_1 = __importDefault(require("./.storybook"));
SplashScreen.preventAutoHideAsync();
function App() {
    const [fontsLoaded, fontError] = (0, expo_font_1.useFonts)({
        'SpaceGrotesk-Bold': require('./assets/fonts/SpaceGrotesk-Bold.otf'),
        'SpaceGrotesk-Light': require('./assets/fonts/SpaceGrotesk-Light.otf'),
        'SpaceGrotesk-Medium': require('./assets/fonts/SpaceGrotesk-Medium.otf'),
        'SpaceGrotesk-Regular': require('./assets/fonts/SpaceGrotesk-Regular.otf'),
    });
    const onLayoutRootView = (0, react_1.useCallback)(async () => {
        if (fontsLoaded || fontError) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded, fontError]);
    console.log({ fontsLoaded, fontError });
    if (!fontsLoaded && !fontError) {
        return null;
    }
    return (<react_native_gesture_handler_1.GestureHandlerRootView style={{ flex: 1 }}>
      <react_native_1.View style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <_storybook_1.default />
      </react_native_1.View>
    </react_native_gesture_handler_1.GestureHandlerRootView>);
}
exports.default = App;
//# sourceMappingURL=App.js.map