import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Splash from "./screens/Splash";
import Mnemonic from "./screens/Mnemonic";
import Transaction from "./screens/Transaction";

export type KeyRotationRoutes = {
  Splash: {
    address: string;
  };
  Mnemonic: {
    address: string;
  };
  Transaction: {
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
        name="Transaction"
        component={Transaction}
      />
    </Stack.Navigator>
  );
}

export default KeyRotationRouter;
