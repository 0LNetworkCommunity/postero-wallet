import { StackScreenProps } from "@react-navigation/stack";
import { FC } from "react";
import { View, Text } from "react-native";
import QRCode from "react-native-qrcode-svg";
import tw from "twrnc";
import { ModalStackParams } from "../params";

const WalletDetails: FC<
  StackScreenProps<ModalStackParams, "WalletDetails">
> = ({ route, navigation }) => {
  const { walletAddress } = route.params;
  return (
    <View style={tw.style("flex-1 items-center justify-center")}>
      <Text selectable>{walletAddress}</Text>
      <View
        style={tw.style("items-center justify-center", {
          width: 128,
          height: 128,
        })}
      >
        <QRCode value={walletAddress} />
      </View>
    </View>
  );
};

export default WalletDetails;
