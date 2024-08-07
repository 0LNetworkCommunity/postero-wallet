import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Root from "./screens/Root";
import CreateWallet from "./screens/CreateWallet";
import { NewWalletStackParams } from "./params";
import SafetyWarning from "./screens/SafetyWarning";
import NewMnemonic from "./screens/NewMnemonic";
import MnemonicImport from "./screens/MnemonicImport";
import PrivateKeyImport from "./screens/PrivateKeyImport";

const Stack = createNativeStackNavigator<NewWalletStackParams>();

function NewWalletRouter() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Root"
        component={Root}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="CreateWallet" component={CreateWallet} />
      <Stack.Screen
        name="SafetyWarning"
        component={SafetyWarning}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NewMnemonic"
        component={NewMnemonic}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="MnemonicImport" component={MnemonicImport} />
      <Stack.Screen name="PrivateKeyImport" component={PrivateKeyImport} />
    </Stack.Navigator>
  );
}

export default NewWalletRouter;
