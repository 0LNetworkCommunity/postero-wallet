import { View } from "react-native";
import styled from "@emotion/native";

import Text from "../../../components/Text";
import Separator from "../../../components/Separator";
import { Edit04Icon, PasscodeLockIcon } from "../../../icons";
import EyeOffIcon from "../../../icons/EyeOffIcon";
import { Button, ButtonSize, ButtonVariation } from "../../../components";
import { GenericScreen } from "../../../components/GenericScreen";

const Tip = styled.View({
  width: "100%",
  paddingVertical: 20,
  paddingHorizontal: 16,
  flexDirection: "row",
  alignItems: "center",
});

const TipText = styled.View({
  flex: 1,
});

const Icon = styled.View({
  marginRight: 8,
});

export function SplashScreen() {
  return (
    <GenericScreen
      title="Create new wallet"
      subtitle="You have full control and custody over your assets. A 12-word secret recovery phase will be generated to secure your account."
      onBack={() => {}}
      body={
        <View>
          <Separator />
          <Tip>
            <Icon>
              <PasscodeLockIcon color="#CD3B42" />
            </Icon>
            <TipText>
              <Text text sm regular>
                Your recovery phrase is your only backup to access your wallet.
              </Text>
            </TipText>
          </Tip>
          <Separator />
          <Tip>
            <Icon>
              <Edit04Icon color="#CD3B42" />
            </Icon>
            <TipText>
              <Text text sm regular>
                Write it down and keep it safe.
              </Text>
            </TipText>
          </Tip>
          <Separator />
          <Tip>
            <Icon>
              <EyeOffIcon color="#CD3B42" />
            </Icon>
            <TipText>
              <Text text sm regular>
                Do not share your recovery phase with anyone!
              </Text>
            </TipText>
          </Tip>
          <Separator />
        </View>
      }
      footer={
        <View style={{ padding: 16 }}>
          <Button
            variation={ButtonVariation.Primary}
            size={ButtonSize.XXL}
            title="Continue"
            onPress={() => {}}
          />
        </View>
      }
    />
  );
}
