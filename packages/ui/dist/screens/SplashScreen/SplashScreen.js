"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SplashScreen = void 0;
const react_native_1 = require("react-native");
const native_1 = __importDefault(require("@emotion/native"));
const Text_1 = __importDefault(require("../../components/Text"));
const components_1 = require("../../components");
const Container = native_1.default.SafeAreaView((props) => ({
    backgroundColor: props.theme.colors.bgPrimary,
    flex: 1,
    justifyContent: "flex-end",
}));
function SplashScreen() {
    return (<Container>
      <components_1.Logo />
      <react_native_1.View style={{ paddingTop: 24, paddingBottom: 64 }}>
        <Text_1.default md regular>
          The most trusted and secure wallet for 0L Network
        </Text_1.default>
      </react_native_1.View>
      <components_1.Button title="Create a new wallet" size={components_1.ButtonSize.XXL} style={{ marginBottom: 11 }} onPress={() => { }}/>
      <components_1.Button title="Import a wallet" size={components_1.ButtonSize.XXL} variation={components_1.ButtonVariation.Secondary} onPress={() => { }}/>
    </Container>);
}
exports.SplashScreen = SplashScreen;
//# sourceMappingURL=SplashScreen.js.map