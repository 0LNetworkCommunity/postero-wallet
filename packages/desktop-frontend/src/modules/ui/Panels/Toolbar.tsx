import { FC, PropsWithChildren, useRef } from "react";
import { GestureResponderEvent, View } from "react-native";
import tw from "twrnc";
import { WalletIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

import { useWindowState } from "../../window-state";
import { WindowState } from "../../window-state/types";
import TitleBarButton from "../TitleBar/TitleButton";
import LeftSidebarIcon from "../icons/LeftSidebarIcon";
import RightSidebarIcon from "../icons/RightSidebarIcon";
import IpcRenderer from "../../backend/ipc-renderer";
import { ContextMenu } from "../../../types";

const ipcRenderer: IpcRenderer = (window as any).electron.ipcRenderer;

type Props = PropsWithChildren<{
  leftSidebarVisible: boolean;
  rightSidebarVisible: boolean;

  onToggleLeftSidebar: () => void;
  onToggleRightSidebar: () => void;
}>;

const Toolbar: FC<Props> = ({
  children,
  leftSidebarVisible,
  rightSidebarVisible,
  onToggleLeftSidebar,
  onToggleRightSidebar,
}) => {
  const win = useWindowState();
  const walletActionButton = useRef<View>(null);

  const onWalletActionPressed = (event: GestureResponderEvent) => {
    const el = walletActionButton.current!;
    if (el instanceof Element) {
      const rect = el.getBoundingClientRect();
      ipcRenderer.send("context-menu", {
        menu: ContextMenu.ToolbarWalletAction,
        position: {
          y: rect.y + rect.height,
          x: rect.x,
        },
      });
    }
  };

  return (
    <View
      style={tw.style({
        width: "100%",
        height: 38,

        userSelect: "none",
        appRegion: "drag",
        backgroundColor: "#F6F6F6",

        boxShadow:
          win.state === WindowState.Foreground
            ? "0 1px 0 0 rgba(0,0,0,0.05)"
            : "0 1px 0 0 rgba(0,0,0,0.05)",
        position: "relative",
        zIndex: 1000,
      })}
    >
      <View
        style={tw.style({
          paddingLeft: win.frame ? 20 : 90,
          paddingRight: 20,
          width: "100%",
          height: "100%",
          backgroundColor:
            win.state === WindowState.Foreground
              ? "rgba(255,255,255,0.80)"
              : "rgba(230,230,230,0.50)",
          flexDirection: "row",
          alignItems: "center",
          position: "relative",
          zIndex: 2,
        })}
      >
        {children}

        {!leftSidebarVisible && (
          <TitleBarButton onPress={() => onToggleLeftSidebar()}>
            <LeftSidebarIcon style={tw.style("w-6 h-6")} />
          </TitleBarButton>
        )}
        <View style={{ flexGrow: 1 }} />

        <TitleBarButton
          ref={walletActionButton}
          onPress={onWalletActionPressed}
        >
          <WalletIcon style={tw.style("w-5 h-5")} />
          <ChevronDownIcon style={tw.style("w-4 h-4")} />
        </TitleBarButton>

        {!rightSidebarVisible && (
          <TitleBarButton onPress={() => onToggleRightSidebar()}>
            <RightSidebarIcon style={tw.style("w-6 h-6")} />
          </TitleBarButton>
        )}
      </View>
    </View>
  );
};

export default Toolbar;
