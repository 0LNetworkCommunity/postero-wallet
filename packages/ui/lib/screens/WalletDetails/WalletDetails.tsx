import { View, LayoutChangeEvent } from "react-native";
import QRCode from "react-native-qrcode-svg";
import styled from "@emotion/native";
import { useState } from "react";
import * as Clipboard from "expo-clipboard";
import { Share } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import { Text } from "../../components/Text";
import { Button, ButtonSize, ButtonVariation } from "../../components/Button";
import { XCloseIcon } from "../../icons/XCloseIcon";

const Container = styled.SafeAreaView({
  flex: 1,
  backgroundColor: "#ffffff",
  alignItems: "center",
});

interface Props {
  label: string;
  address: string;
  onClose?: () => void;
}

export function WalletDetails({ label, address, onClose }: Props) {
  const [width, setWidth] = useState<number>();

  const onLayout = (event: LayoutChangeEvent) => {
    if (width !== event.nativeEvent.layout.width) {
      setWidth(event.nativeEvent.layout.width);
    }
  };

  return (
    <Container>
      <View
        style={{
          width: "100%",
          alignItems: "center",
          padding: 12,
          flexDirection: "row",
        }}
      >
        <Text text md medium style={{ flex: 1 }} numberOfLines={1}>
          {label}
        </Text>
        {onClose && (
          <TouchableOpacity onPress={onClose} style={{ padding: 12 }}>
            <XCloseIcon size={20} color="#525252" />
          </TouchableOpacity>
        )}
      </View>

      <View
        style={{
          flex: 1,
          alignItems: "center",
          paddingHorizontal: 20,
          justifyContent: "center",
        }}
      >
        <Text text lg medium>
          Send LIBRA (Ƚ) to this address
        </Text>

        <View style={{ width: "60%", overflow: "hidden" }} onLayout={onLayout}>
          <View style={{ paddingVertical: 32 }}>
            {width && <QRCode value={address} size={width} />}
          </View>

          <Text text sm regular selectable>
            {address}
          </Text>
        </View>
      </View>
      <View style={{ width: "100%", paddingHorizontal: 20 }}>
        <Button
          size={ButtonSize.XXL}
          variation={ButtonVariation.Primary}
          title="Copy Address"
          style={{ marginTop: 12, width: "100%" }}
          onPress={() => Clipboard.setStringAsync(address)}
        />
        <Button
          size={ButtonSize.XXL}
          variation={ButtonVariation.Secondary}
          title="Share"
          style={{ marginTop: 12, width: "100%" }}
          onPress={() => {
            Share.share({
              message: address,
            });
          }}
        />
      </View>
    </Container>
  );
}
