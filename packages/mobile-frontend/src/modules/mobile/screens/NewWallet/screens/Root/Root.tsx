import { Button, ButtonVariation } from "@postero/ui";
import { StackScreenProps } from "@react-navigation/stack";
import { SafeAreaView, View } from "react-native";
import { NewWalletStackParams } from "../../params";

function Root({ navigation }: StackScreenProps<NewWalletStackParams, "Root">) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 10, justifyContent: "flex-end" }}>
        <Button
          title="Create a new wallet"
          variation={ButtonVariation.Primary}
          onPress={() => {
            navigation.navigate("SafetyWarning");
          }}
        />
        <Button
          title="Import a wallet"
          variation={ButtonVariation.Secondary}
          onPress={() => {
            navigation.navigate("ImportWallet");
          }}
        />
      </View>
    </SafeAreaView>
  );
}

export default Root;
