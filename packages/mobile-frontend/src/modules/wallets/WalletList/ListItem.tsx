import { FC, createRef, useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import tw from "twrnc";

import { Wallet } from "../hook";
import IpcRenderer from "../../backend/ipc-renderer";
import { useWindowState } from "../../window-state";
import { ContextMenu } from "../../../types";
import { useSettings } from "../../settings";
import { WindowState } from "../../window-state/types";

const ipcRenderer: IpcRenderer = (window as any).electron.ipcRenderer;

interface Props {
  wallet: Wallet;
  active: boolean;
  onPress: () => void;
  onDoubleClick: () => void;
}

const ListItem: FC<Props> = ({ wallet, active, onPress, onDoubleClick }) => {
  const el = createRef<View>();
  const win = useWindowState();
  const { accentColor } = useSettings();

  useEffect(() => {
    const onContext = () => {
      ipcRenderer.send("context-menu", {
        menu: ContextMenu.WalletAction,
        data: {
          id: wallet.id,
        },
      });
    };

    const div = el.current as unknown as HTMLDivElement;
    div.addEventListener("contextmenu", onContext);

    return () => {
      div.removeEventListener("contextmenu", onContext);
    };
  }, []);

  useEffect(() => {
    const div = el.current as unknown as HTMLDivElement;
    const listener = () => {
      onDoubleClick();
    };
    div.addEventListener("dblclick", listener);
    return () => {
      div.removeEventListener("dblclick", listener);
    };
  }, [onDoubleClick]);

  return (
    <Pressable onPress={onPress}>
      <View
        ref={el}
        style={tw.style(
          "px-3 py-2",
          "border-b border-gray-900/5",
          active &&
            (win.state === WindowState.Foreground
              ? {
                  backgroundColor: accentColor,
                }
              : {
                  backgroundColor: "gray",
                })
        )}
      >
        <Text
          style={tw.style(
            "text-sm font-semibold leading-6 text-gray-900",
            active && "text-white"
          )}
          numberOfLines={1}
          ellipsizeMode="middle"
        >
          {wallet.label}
        </Text>
        <Text
          style={tw.style("text-sm text-gray-500", active && "text-white", {
            fontFamily: "mononoki-Bold",
          })}
          numberOfLines={1}
          ellipsizeMode="middle"
        >
          {wallet.accountAddress}
        </Text>
      </View>
    </Pressable>
  );
};

export default ListItem;
