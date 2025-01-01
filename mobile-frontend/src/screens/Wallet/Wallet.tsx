import { ReactNode, useRef } from "react";
import { SafeAreaView } from "react-native";
import tw from "twrnc";

import { StackScreenProps } from "@react-navigation/stack";

import { ModalStackParams } from "../params";
import WalletBase from "./WalletBase";
import ContextMenu, { ContextMenuHandle } from "./ContextMenu";

function WalletScreen({
  route,
  navigation,
}: StackScreenProps<ModalStackParams, "Wallet">): ReactNode {
  const { walletAddress } = route.params;
  const contextMenu = useRef<ContextMenuHandle>(null);

  return (
    <SafeAreaView style={tw.style("flex-1 bg-white")}>
      <WalletBase
        walletAddress={walletAddress}
        onPressSettings={() => {
          contextMenu.current?.open();
        }}
      />

      <ContextMenu ref={contextMenu} walletAddress={walletAddress} />
    </SafeAreaView>
  );
}

export default WalletScreen;
