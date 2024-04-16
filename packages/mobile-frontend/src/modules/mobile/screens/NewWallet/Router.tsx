import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Root from "./screens/Root";
import CreateWallet from "./screens/CreateWallet";
import { NewWalletStackParams } from "./params";
import SafetyWarning from "./screens/SafetyWarning";
import SeedPhrase from "./screens/SeedPhrase";
import ImportWallet from "./screens/ImportWallet";

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
      <Stack.Screen name="SafetyWarning" component={SafetyWarning} />
      <Stack.Screen name="SeedPhrase" component={SeedPhrase} />
      <Stack.Screen name="ImportWallet" component={ImportWallet} />
    </Stack.Navigator>
  );
}

export default NewWalletRouter;
