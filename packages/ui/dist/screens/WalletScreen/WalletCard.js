"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
const DotsHorizontalIcon_1 = require("../../icons/DotsHorizontalIcon");
const react_native_gesture_handler_1 = require("react-native-gesture-handler");
const Art_1 = __importDefault(require("./Art"));
function WalletCard() {
    return (<react_native_1.View style={{
            width: "100%",
            height: "100%",
            borderRadius: 12,
            overflow: "hidden",
            backgroundColor: "#D5D2DF",
        }}>
      <react_native_1.View style={react_native_1.StyleSheet.absoluteFill}>

        <react_native_1.View style={react_native_1.StyleSheet.absoluteFill}>
          <Art_1.default />
        </react_native_1.View>

        <react_native_1.View style={{
            padding: 20,
            width: "100%",
            height: "100%",
            justifyContent: "space-between",
        }}>
          <react_native_1.View style={{
            flexDirection: "row",
            justifyContent: "space-between",
        }}>
            <react_native_1.View>
              <react_native_1.Text style={{
            fontSize: 18,
            lineHeight: 28,
            color: "#FFFFFF",
            fontFamily: "SpaceGrotesk-Medium",
        }}>
                Wallet A
              </react_native_1.Text>
              <react_native_1.Text style={{
            fontSize: 16,
            lineHeight: 24,
            color: "#FFFFFF",
            fontFamily: "SpaceGrotesk-Regular",
        }}>
                $26,942.16
              </react_native_1.Text>
            </react_native_1.View>
            <react_native_1.View>
              <react_native_gesture_handler_1.TouchableOpacity onPress={() => console.log("lol")}>
                <DotsHorizontalIcon_1.DotsHorizontalIcon size={20} color="#FFFFFF"/>
              </react_native_gesture_handler_1.TouchableOpacity>
            </react_native_1.View>
          </react_native_1.View>
          <react_native_1.View>
            <react_native_1.Text style={{
            fontSize: 20,
            lineHeight: 30,
            color: "white",
            fontFamily: "SpaceGrotesk-Bold",
        }}>
              3,685,928.113 Ƚ
            </react_native_1.Text>
          </react_native_1.View>
        </react_native_1.View>
      </react_native_1.View>
    </react_native_1.View>);
}
exports.default = WalletCard;
//# sourceMappingURL=WalletCard.js.map