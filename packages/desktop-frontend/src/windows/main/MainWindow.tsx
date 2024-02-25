import { FC } from "react";
import { StatusBar } from "expo-status-bar";
import { ApolloProvider } from "@apollo/client";

import apolloClient from "../../modules/backend/apollo-client";
import { View } from "react-native";

import tw from "twrnc";
import { AptosProvider } from "../../modules/aptos";
import Router from "./Router";
import WindowStateProvider from "../../modules/window-state/WindowStateProvider";

const MainWindow: FC = () => {
  return (
    <View
      style={tw.style({
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      })}
    >
      <WindowStateProvider>
        <StatusBar style="auto" />
        <ApolloProvider client={apolloClient}>
          <AptosProvider>
            <Router />
          </AptosProvider>
        </ApolloProvider>
      </WindowStateProvider>
    </View>
  );
};
export default MainWindow;
