import { View } from "react-native";
import styled from '@emotion/native';

import { Text } from "../../components/Text";
import { Button, ButtonSize, ButtonVariation, Logo } from "../../components";

const Container = styled.SafeAreaView((props) => ({
  backgroundColor: props.theme.colors.bgPrimary,
  flex: 1,
  // alignItems: "flex-end",
  justifyContent: "flex-end",

}));

// const SomeText = styled(Text, (props) => ({
//   fontFamily: fonts.primary[400],
//   fontSize: 36,
//   lineHeight: 44,
//   letterSpacing: -0.72,
//   color: props.theme.colors.text.primary[900],
// }));

// color: var(--colors-text-text-primary-900, #F5F5F6);

// /* Display md/Regular */
// font-family: "Space Grotesk";
// font-size: 36px;
// font-style: normal;
// font-weight: 400;
// line-height: 44px; /* 122.222% */
// letter-spacing: -0.72px;

export function SplashScreen() {
  return (
    <Container>
      <Logo />
      <View style={{ paddingTop: 24, paddingBottom: 64 }}>
        <Text md regular>
          The most trusted and secure wallet for 0L Network
        </Text>
      </View>
      <Button
        title="Create a new wallet"
        size={ButtonSize.XXL}
        style={{ marginBottom: 11 }}
        onPress={() => {}}
      />
      <Button
        title="Import a wallet"
        size={ButtonSize.XXL}
        variation={ButtonVariation.Secondary}
        onPress={() => {}}
      />
    </Container>
  );
}
