import { Button } from "@postero/ui";
import { View, Text } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";

import { NewWalletStackParams } from "../../params";

function SafetyWarning({
  navigation,
}: StackScreenProps<NewWalletStackParams, "SafetyWarning">) {
  return (
    <View style={{ flex: 1 }}>
      <Text>Securing your wallet</Text>
      <Button
        title="Continue"
        onPress={() => {
          navigation.navigate("SeedPhrase");
        }}
      />
    </View>
  );
}

export default SafetyWarning;
