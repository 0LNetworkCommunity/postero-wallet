import { View, Text, StyleSheet } from "react-native";
import DotsHorizontalIcon from "../../icons/DotsHorizontalIcon";
import { TouchableOpacity } from "react-native-gesture-handler";
import Art from "./Art";

function WalletCard() {
  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        borderRadius: 12,
        overflow: "hidden",
        backgroundColor: "#D5D2DF",
      }}
    >
      <View style={StyleSheet.absoluteFill}>

        <View style={StyleSheet.absoluteFill}>
          <Art />
        </View>

        <View
          style={{
            padding: 20,
            width: "100%",
            height: "100%",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: 18,
                  lineHeight: 28,
                  color: "#FFFFFF",
                  fontFamily: "SpaceGrotesk-Medium",
                }}
              >
                Wallet A
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  lineHeight: 24,
                  color: "#FFFFFF",
                  fontFamily: "SpaceGrotesk-Regular",
                }}
              >
                $26,942.16
              </Text>
            </View>
            <View>
              <TouchableOpacity onPress={() => console.log("lol")}>
                <DotsHorizontalIcon size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
          <View>
            <Text
              style={{
                fontSize: 20,
                lineHeight: 30,
                color: "white",

                fontFamily: "SpaceGrotesk-Bold",
              }}
            >
              3,685,928.113 Ƚ
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default WalletCard;
