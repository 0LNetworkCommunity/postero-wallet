import { FC } from "react";
import { NavigationContainer } from "@react-navigation/native";

import WalletsScreen from "../../modules/wallets";
import DAppsScreen from "../../modules/dapps";
import PendingTransactionsScreen from "../../modules/pending-transactions";
import { createPanelsNavigator } from "../../modules/panels-navigator/navigators/createPanelsNavigator";

const Panels = createPanelsNavigator();

const Router: FC = () => {
  return (
    <NavigationContainer>
      <Panels.Navigator>
        <Panels.Screen
          name="Transactions"
          component={PendingTransactionsScreen}
        />
        <Panels.Screen name="Wallets" component={WalletsScreen} />
        <Panels.Screen name="DApps" component={DAppsScreen} />
      </Panels.Navigator>
    </NavigationContainer>
  );
};

export default Router;
