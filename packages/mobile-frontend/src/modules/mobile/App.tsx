import { FC, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  ApolloClient,
  ApolloProvider,
  NormalizedCacheObject,
} from "@apollo/client";

import MainScreen from "./screens/Main";
import NewWalletScreen from "./screens/NewWallet";
import WalletScreen from "./screens/Wallet";

import bootstrap from "../mobile-backend";
import { getApolloClient } from "../backend/apollo-client";
import { ModalStackParams } from "./screens/params";
import NewTransfer from "./screens/NewTransfer";
import WalletDetails from "./screens/WalletDetails";
import BarCodeScanner from "./screens/BarCodeScanner";

const Stack = createNativeStackNavigator<ModalStackParams>();

const App: FC = () => {
  const [apolloClient, setApolloClient] =
    useState<ApolloClient<NormalizedCacheObject>>();

  useEffect(() => {
    const load = async () => {
      const backend = await bootstrap();

      setApolloClient(getApolloClient(backend));
    };
    load().catch((error) => {
      console.error(error);
    });
  }, []);

  if (!apolloClient) {
    return null;
  }

  return (
    <ApolloProvider client={apolloClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Main"
              component={MainScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="NewWallet"
              component={NewWalletScreen}
              options={{
                headerShown: false,
                presentation: "modal",
              }}
            />
            <Stack.Screen
              name="Wallet"
              component={WalletScreen}
              options={{
                headerShown: false,
                presentation: "modal",
              }}
            />
            <Stack.Screen
              name="NewTransfer"
              component={NewTransfer}
              options={{
                headerShown: false,
                presentation: "modal",
              }}
            />
            <Stack.Screen
              name="WalletDetails"
              component={WalletDetails}
              options={{
                headerShown: false,
                presentation: "modal",
              }}
            />
            <Stack.Screen
              name="BarCodeScanner"
              component={BarCodeScanner}
              options={{
                headerShown: false,
                presentation: "modal",
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </GestureHandlerRootView>
    </ApolloProvider>
  );
};

export default App;
