import { CompositeScreenProps } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { SafeAreaView, View, Text } from "react-native";

import { Button } from "@postero/ui";
import { KeyRotationRoutes } from "../../Router";
import { ModalStackParams } from "../../../params";

function Splash({
  navigation,
  route,
}: CompositeScreenProps<
  StackScreenProps<KeyRotationRoutes, "Splash">,
  StackScreenProps<ModalStackParams>
>) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View>
        <Text>
          Key rotation allows you to replace your current private key with a new
          one. This update is made without altering your wallet address. The
          current private key will not be automatically removed and will remain on
          your device.
        </Text>
      </View>

      <Button
        title="Continue"
        onPress={() => {
          navigation.navigate("Mnemonic", { address: route.params.address });
        }}
      />

      <Button
        title="Cancel"
        onPress={() => {
          navigation.pop();
        }}
      />
    </SafeAreaView>
  );
}

export default Splash;