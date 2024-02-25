import { FC } from "react";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import WalletIcon from "../../icons/WalletIcon";
import PlusIcon from "../../icons/PlusIcon";
import HomeScreen from "../Home";
import SettingsScreen from "../Settings";
import WalletsScreen from "../Wallets";

const Tab = createBottomTabNavigator();

const Main: FC = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Wallets"
        component={WalletsScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <WalletIcon color={color} />
            );
          },
          headerRight: () => {
            const navigation = useNavigation<any>();

            return (
              <View>
                <PlusIcon
                  onPress={() => {
                    navigation.navigate("NewWallet");
                  }}
                />
              </View>
            );
          },
        }}
      />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default Main;
