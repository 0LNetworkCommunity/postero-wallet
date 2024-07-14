import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Splash from "./screens/Splash";
import Mnemonic from "./screens/Mnemonic";
import KeyRotationTransaction from "./screens/KeyRotationTransaction";

export type KeyRotationRoutes = {
  Splash: {
    address: string;
  };
  Mnemonic: {
    address: string;
  };
  KeyRotationTransaction: {
    address: string;
    publicKey: string;
  };
}

const Stack = createNativeStackNavigator<KeyRotationRoutes>();

function KeyRotationRouter() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Splash"
        component={Splash}
      />
      <Stack.Screen
        name="Mnemonic"
        component={Mnemonic}
      />
      <Stack.Screen
        name="KeyRotationTransaction"
        component={KeyRotationTransaction}
      />
    </Stack.Navigator>
  );
}

export default KeyRotationRouter;
