import { ReactNode, useRef } from "react";
import { SafeAreaView } from "react-native";

import { StackScreenProps } from "@react-navigation/stack";

import { ModalStackParams } from "../params";
import WalletBase from "./WalletBase";
import ContextMenu, { ContextMenuHandle } from "./ContextMenu";

function WalletScreen({
  route,
  navigation,
}: StackScreenProps<ModalStackParams, "Wallet">): ReactNode {
  const { walletId } = route.params;
  const contextMenu = useRef<ContextMenuHandle>(null);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <WalletBase
        walletId={walletId}
        onPressSettings={() => {
          contextMenu.current?.open();
        }}
      />

      <ContextMenu ref={contextMenu} walletId={walletId} />
    </SafeAreaView>
  );
}

export default WalletScreen;
