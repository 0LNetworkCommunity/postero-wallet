import { Pressable, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { View, Text, GestureResponderEvent } from "react-native";
import {
  WindowIcon,
  HomeIcon,
  WalletIcon,
  DocumentCheckIcon,
} from "@heroicons/react/20/solid";
import { LinearGradient } from "expo-linear-gradient";

import { useWindowState } from "../../window-state";
import tw from "twrnc";
import { WindowState } from "../../window-state/types";
import { PanelsDescriptor } from "../types";
import { useSettings } from "../../settings";

const styles = StyleSheet.create({
  containerActive: {
    backgroundColor: "rgba(246, 246, 246, 0.84)",
  },
  container: {
    borderRadius: 5,
    paddingTop: 4,
    paddingBottom: 4,
    cursor: "pointer",
    paddingLeft: 8,
    paddingRight: 8,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
});

type Props = {
  /**
   * Function to execute on press in React Native.
   * On the web, this will use onClick.
   */
  onPress: (
    e: React.MouseEvent<HTMLElement, MouseEvent> | GestureResponderEvent
  ) => void;

  /**
   * The descriptor object for the route.
   */
  descriptor: PanelsDescriptor;

  /**
   * The label text of the tab.
   */
  label: string;

  active: boolean;
};

const icons = new Map([
  ["Home", HomeIcon],
  ["Wallets", WalletIcon],
  ["DApps", WindowIcon],
  ["Transactions", DocumentCheckIcon],
]);

function SidebarItem({ label, onPress, active }: Props) {
  const win = useWindowState();
  const { accentColor } = useSettings();

  const Icon = icons.get(label);

  if (active) {
    return (
      <Pressable onPress={onPress}>
        {/* <View style={[styles.container, active && styles.containerActive]}> */}
        <LinearGradient
          // Background Linear Gradient
          colors={[
            // 'rgba(0,0,0,0.8)',
            // 'transparent'

            "rgba(0, 0, 0, 0.04)",
            "rgba(0, 0, 0, 0.05)",
          ]}
          style={tw.style(styles.container, {
            opacity: win.state === WindowState.Foreground ? 1 : 0.3,
          })}
        >
          {Icon && (
            <Icon
              style={{
                width: 20,
                height: 20,
                color: accentColor,
                paddingRight: 4,
              }}
            />
          )}
          <Text>{label}</Text>
        </LinearGradient>
      </Pressable>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      {/* <View style={[styles.container, active && styles.containerActive]}> */}
      <View
        style={tw.style(styles.container, {
          opacity: win.state === WindowState.Foreground ? 1 : 0.5,
        })}
      >
        {Icon && (
          <Icon
            style={{
              width: 20,
              height: 20,
              color: accentColor,
              paddingRight: 4,
            }}
          />
        )}
        <Text>{label}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

export default SidebarItem;
