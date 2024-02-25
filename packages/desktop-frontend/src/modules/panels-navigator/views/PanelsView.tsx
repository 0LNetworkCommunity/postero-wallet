import type {
  ParamListBase,
  TabNavigationState,
} from "@react-navigation/native";
import tw from "twrnc";
import * as Screens from "react-native-screens";
import { StyleSheet, View } from "react-native";

import {
  PanelsNavigationConfig,
  PanelsNavigationHelpers,
  PanelsDescriptorMap,
  NavigationSidebarProps,
} from "../types";
import PanelGroup from "../../ui/Panels/PanelGroup";
import NavigationSidebar from "./NavigationSidebar";
import PreviewProvider from "../../preview-panel/PreviewPanelProvider";
import { ReactNode, useState } from "react";

const styles = StyleSheet.create({
  left: {
    flexDirection: "row-reverse",
  },
  right: {
    flexDirection: "row",
  },
  screens: {
    flex: 1,
    overflow: "hidden",
  },
});

type Props = PanelsNavigationConfig & {
  state: TabNavigationState<ParamListBase>;
  navigation: PanelsNavigationHelpers;
  descriptors: PanelsDescriptorMap;
};

export function PanelsView(props: Props) {
  const navigationSidebar = (props: NavigationSidebarProps) => (
    <NavigationSidebar {...props} />
  );
  const [previews, setPreviews] = useState<Record<string, ReactNode>>({});
  const { state, navigation, descriptors } = props;
  const { routes } = state;
  const focusedRoute = state.routes[state.index];

  return (
    <PanelGroup
      leftPanel={navigationSidebar({
        state,
        descriptors,
        navigation,
      })}
      mainPanel={
        <Screens.ScreenContainer style={styles.screens}>
          {routes.map((route, index) => {
            const descriptor = descriptors[route.key];

            const isFocused = state.index === index;

            return (
              <PreviewProvider
                key={route.key}
                preview={previews[route.key]}
                setPreview={(preview: ReactNode) => {
                  setPreviews({
                    ...previews,
                    [route.key]: preview,
                  });
                }}
              >
                <Screens.Screen
                  style={[
                    StyleSheet.absoluteFill,
                    {
                      backgroundColor: "#F6F6F6",
                      flexGrow: 1,
                      zIndex: isFocused ? 0 : -1,
                    },
                  ]}
                >
                  {descriptor.render()}
                </Screens.Screen>
              </PreviewProvider>
            );
          })}
        </Screens.ScreenContainer>
      }
      rightPanel={
        <View
          style={tw.style({
            backgroundColor: "#FFFFFF",
            flexGrow: 1,
            boxShadow: "-1px 0px 1px 0px rgba(0, 0, 0, 0.05)",
          })}
        >
          {previews[focusedRoute.key]}
        </View>
      }
    />
  );
}
