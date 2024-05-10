import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Splash from "./screens/Splash";
import Mnemonic from "./screens/Mnemonic";

export type KeyRotationRoutes = {
  Splash: {
    address: string;
  };
  Mnemonic: {
    address: string;
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
    </Stack.Navigator>
  );
}

export default KeyRotationRouter;
