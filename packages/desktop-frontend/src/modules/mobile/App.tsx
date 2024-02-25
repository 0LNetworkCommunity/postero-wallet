import { FC } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ApolloProvider } from "@apollo/client";

import MainScreen from "./screens/Main";
import NewWalletScreen from "./screens/NewWallet";
import WalletScreen from "./screens/Wallet";
import apolloClient from "./apollo-client";

const Stack = createNativeStackNavigator();

const App: FC = () => {
  return (
    <ApolloProvider client={apolloClient}>
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
          <Stack.Screen name="Wallet" component={WalletScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ApolloProvider>
  );
};

export default App;
