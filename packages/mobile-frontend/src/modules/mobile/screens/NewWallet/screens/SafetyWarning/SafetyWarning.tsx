import { WalletCreation } from "@postero/ui";
import { StackScreenProps } from "@react-navigation/stack";

import { NewWalletStackParams } from "../../params";

function SafetyWarning({
  navigation,
}: StackScreenProps<NewWalletStackParams, "SafetyWarning">) {
  return (
    <WalletCreation.SplashScreen
      onBack={() => navigation.pop()}
      onContinue={() => {
        navigation.navigate("NewMnemonic");
      }}
    />
  );
}

export default SafetyWarning;
