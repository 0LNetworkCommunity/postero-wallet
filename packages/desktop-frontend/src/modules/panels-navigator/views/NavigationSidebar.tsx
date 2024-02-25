import { FC } from "react";
import { View } from "react-native";
import {
  CommonActions,
  NavigationContext,
  NavigationRouteContext,
} from "@react-navigation/native";

import { NavigationSidebarProps } from "../types";
import SidebarItem from "./SidebarItem";

type Props = NavigationSidebarProps;

const NavigationSidebar: FC<Props> = ({ state, navigation, descriptors }) => {
  const { routes } = state;

  return (
    <View
      style={{
        height: "100%",
        width: "100%",
        paddingTop: 10,
        paddingLeft: 10,
        paddingRight: 10,
      }}
    >
      {routes.map((route, index) => {
        const focused = index === state.index;
        const label = route.name;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!focused && !event.defaultPrevented) {
            navigation.dispatch({
              ...CommonActions.navigate(route),
              target: state.key,
            });
          }
        };

        return (
          <NavigationContext.Provider
            key={route.key}
            value={descriptors[route.key].navigation}
          >
            <NavigationRouteContext.Provider
              value={route}
            >
              <SidebarItem
                descriptor={descriptors[route.key]}
                active={focused}
                label={label}
                onPress={onPress}
              />
            </NavigationRouteContext.Provider>
          </NavigationContext.Provider>
        );
      })}
    </View>
  );
};

export default NavigationSidebar;
