import { FC, useState } from "react";
import { View, StyleSheet } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";

import WalletList from "./WalletList";
import PanelPreview from "../preview-panel/PanelPreview";
import WalletView from "./WalletView";

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    flexDirection: "column-reverse",
  },

  content: {
    flexGrow: 1,
  },
});

type Props = StackScreenProps<any>;

const Wallets: FC<Props> = () => {
  const [activeWalletId, setActiveWalletId] = useState<string>();
  return (
    <>
      <View style={styles.container}>
        <WalletList
          activeWalletId={activeWalletId}
          onWalletPress={(walletId: string) => {
            setActiveWalletId(walletId);
          }}
        />
      </View>
      <PanelPreview>
        {activeWalletId && <WalletView id={activeWalletId} />}
      </PanelPreview>
    </>
  );
};

export default Wallets;
