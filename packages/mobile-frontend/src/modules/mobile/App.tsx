import { FC, useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  ApolloClient,
  ApolloProvider,
  NormalizedCacheObject,
} from "@apollo/client";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

import HomeScreen from "./screens/Home";
import NewWalletScreen from "./screens/NewWallet";
import WalletScreen from "./screens/Wallet";

import bootstrap from "../mobile-backend";
import { getApolloClient } from "../backend/apollo-client";
import { ModalStackParams } from "./screens/params";
import NewTransfer from "./screens/NewTransfer";
import WalletDetails from "./screens/WalletDetails";
import BarCodeScanner from "./screens/BarCodeScanner";

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator<ModalStackParams>();

const App: FC = () => {
  const [fontsLoaded, fontError] = useFonts({
    "SpaceGrotesk-Bold": require("./fonts/SpaceGrotesk-Bold.otf"),
    "SpaceGrotesk-Light": require("./fonts/SpaceGrotesk-Light.otf"),
    "SpaceGrotesk-Medium": require("./fonts/SpaceGrotesk-Medium.otf"),
    "SpaceGrotesk-Regular": require("./fonts/SpaceGrotesk-Regular.otf"),
  });

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

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if ((!fontsLoaded && !fontError) || !apolloClient) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <ApolloProvider client={apolloClient}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen
                name="Main"
                component={HomeScreen}
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
    </View>
  );
};

export default App;
