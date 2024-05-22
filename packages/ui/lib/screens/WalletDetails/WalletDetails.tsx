import { LayoutChangeEvent } from "react-native";
import QRCode from 'react-native-qrcode-svg';
import Text from "../../components/Text";
import styled from "@emotion/native";
import { useState } from "react";

const Container = styled.SafeAreaView({
  flex: 1,
  backgroundColor: '#ffffff',
});

interface Props {
  address: string;
}

export function WalletDetails({ address }: Props) {
  const [width, setWidth] = useState<number>();
  const onLayout = (event: LayoutChangeEvent) => {
    if (width !== event.nativeEvent.layout.width) {
      setWidth(event.nativeEvent.layout.width);

    }
  };

  return (
    <Container onLayout={onLayout}>
      <Text text lg medium>
        Send LIBRA (Ƚ) to this address
      </Text>

      <View style={{ width: "60%" }} onLayout={onLayout}>
      {width && <QRCode value={address} size={0.6 * width} />}
      </View>

      <Text text sm regular>{address}</Text>
    </Container>
  );
}
