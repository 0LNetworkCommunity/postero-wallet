import { FC, useCallback, createElement } from "react";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { ApolloProvider } from "@apollo/client";
import { View } from "react-native";
import tw from "twrnc";

import apolloClient from "../backend/apollo-client";
import { AptosProvider } from "../aptos";
import WindowStateProvider from "../window-state/WindowStateProvider";
import MainWindow from "../../windows/main/MainWindow";
import SettingsWindow from "../settings-window/SettingsWindow";
import { WindowType } from "../../types";
import ImportWalletWindow from "../../windows/import-wallet/ImportWalletWindow";
import SettingsProvider from "../settings/SettingsProvider";
import WalletWindow from "../../windows/wallet/WalletWindow";
import NewWalletWindow from "../../windows/new-wallet/NewWalletWindow";

SplashScreen.preventAutoHideAsync();

const Windows = new Map([
  [WindowType.Main, MainWindow],
  [WindowType.Settings, SettingsWindow],
  [WindowType.ImportWallet, ImportWalletWindow],
  [WindowType.Wallet, WalletWindow],
  [WindowType.NewWallet, NewWalletWindow],
]);

const App: FC = () => {
  const url = new URL(window.location.toString());
  const windowType = parseInt(url.searchParams.get("type")!, 10) as WindowType;
  const [fontsLoaded] = useFonts({
    "mononoki-Regular": require("./fonts/mononoki/mononoki-Regular.otf"),
    "mononoki-Bold": require("./fonts/mononoki/mononoki-Bold.otf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  const windowComponent = Windows.get(windowType);
  if (!windowComponent) {
    return null;
  }

  return (
    <View
      onLayout={onLayoutRootView}
      style={tw.style({
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        userSelect: "none",
      })}
    >
      <ApolloProvider client={apolloClient}>
        <SettingsProvider>
          <WindowStateProvider>
            <StatusBar style="auto" />
            <AptosProvider>{createElement(windowComponent)}</AptosProvider>
          </WindowStateProvider>
        </SettingsProvider>
      </ApolloProvider>
    </View>
  );
};

export default App;
