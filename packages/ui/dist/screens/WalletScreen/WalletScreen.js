"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletScreen = void 0;
const react_1 = require("react");
const react_native_1 = require("react-native");
const EyeIcon_1 = __importDefault(require("../../icons/EyeIcon"));
const EyeOffIcon_1 = __importDefault(require("../../icons/EyeOffIcon"));
const QrScanIcon_1 = __importDefault(require("../../icons/QrScanIcon"));
const SwitchVerticalIcon_1 = __importDefault(require("../../icons/SwitchVerticalIcon"));
const Button_1 = require("../../components/Button");
const WalletsCarousel_1 = __importDefault(require("./WalletsCarousel"));
const styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    balanceVisibilityContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    balanceVisibilityLabel: {
        color: "#B7353B",
        marginLeft: 6,
        fontFamily: "SpaceGrotesk-Medium",
        fontSize: 14,
        lineHeight: 20,
    },
    topBarContainer: {
        height: 44,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    totalBalanceLabel: {
        fontFamily: "SpaceGrotesk-Medium",
        fontSize: 14,
        lineHeight: 20,
        color: "#737373",
    },
    totalBalancePrimaryValue: {
        fontFamily: "SpaceGrotesk-Light",
        fontSize: 36,
        lineHeight: 44,
        color: "#141414",
    },
    totalBalanceSecondaryValue: {
        fontFamily: "SpaceGrotesk-Regular",
        fontSize: 14,
        lineHeight: 24,
        color: "#525252",
    },
    ball: {
        width: 100,
        height: 100,
        borderRadius: 100,
        backgroundColor: 'blue',
        alignSelf: 'center',
    },
});
function WalletScreen() {
    const [balanceVisible, setBalanceVisible] = (0, react_1.useState)(true);
    return (<react_native_1.SafeAreaView style={styles.container}>
      <react_native_1.View style={{ width: "100%", paddingHorizontal: 20, paddingVertical: 10 }}>
        <react_native_1.View style={styles.topBarContainer}>
          <react_native_1.TouchableOpacity onPress={() => setBalanceVisible(!balanceVisible)}>
            {balanceVisible ? (<react_native_1.View style={styles.balanceVisibilityContainer}>
                <EyeOffIcon_1.default color="#B7353B" size={20}/>
                <react_native_1.Text style={styles.balanceVisibilityLabel}>Hide balance</react_native_1.Text>
              </react_native_1.View>) : (<react_native_1.View style={styles.balanceVisibilityContainer}>
                <EyeIcon_1.default color="#B7353B" size={20}/>
                <react_native_1.Text style={styles.balanceVisibilityLabel}>Show balance</react_native_1.Text>
              </react_native_1.View>)}
          </react_native_1.TouchableOpacity>

          <react_native_1.TouchableOpacity>
            <QrScanIcon_1.default color="#525252" size={20}/>
          </react_native_1.TouchableOpacity>
        </react_native_1.View>

        <react_native_1.View style={{ marginBottom: 24 }}>
          <react_native_1.View>
            <react_native_1.Text style={styles.totalBalanceLabel}>Total balance</react_native_1.Text>
          </react_native_1.View>
          <react_native_1.View style={{ flexDirection: "row", alignItems: "center" }}>
            <react_native_1.Text style={styles.totalBalancePrimaryValue}>$112,259.90</react_native_1.Text>

            <react_native_1.TouchableOpacity style={{ marginLeft: 8 }}>
              <SwitchVerticalIcon_1.default size={20} color="#525252"/>
            </react_native_1.TouchableOpacity>
          </react_native_1.View>
          <react_native_1.View>
            <react_native_1.Text style={styles.totalBalanceSecondaryValue}>
              9,685,928.113 Ƚ
            </react_native_1.Text>
          </react_native_1.View>
        </react_native_1.View>

        <react_native_1.View style={{ flexDirection: "row", width: "100%" }}>
          <react_native_1.View style={{ width: "50%", paddingRight: 8 }}>
            <Button_1.Button title="Send" size={Button_1.ButtonSize.XL} variation={Button_1.ButtonVariation.Secondary}/>
          </react_native_1.View>
          <react_native_1.View style={{ width: "50%", paddingLeft: 8 }}>
            <Button_1.Button title="Receive" size={Button_1.ButtonSize.XL}/>
          </react_native_1.View>
        </react_native_1.View>
      </react_native_1.View>

      <WalletsCarousel_1.default />
    </react_native_1.SafeAreaView>);
}
exports.WalletScreen = WalletScreen;
//# sourceMappingURL=WalletScreen.js.map