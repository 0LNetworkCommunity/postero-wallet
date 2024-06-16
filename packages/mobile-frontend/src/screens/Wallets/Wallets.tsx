import { FC, useRef } from "react";
import { Alert, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useApolloClient, gql } from "@apollo/client";
import * as Haptics from 'expo-haptics';

import { Button } from '@postero/ui';

import { Wallet, useWallets } from "./hook";
import WalletList from "./WalletList";
import WalletContextMenu, { WalletContextMenuHandle } from "./WalletContextMenu";

const DELETE_WALLET = gql`
  mutation DeleteWallet($address: Bytes!) {
    deleteWallet(address: $address)
  }
`;

const Wallets: FC = () => {
  const walletContextMenu = useRef<WalletContextMenuHandle>(null);
  const apolloClient = useApolloClient();
  const navigation = useNavigation<any>();
  const wallets = useWallets();

  const onWalletDelete = (wallet: Wallet) => {
    Alert.alert("Delete wallet", "This action is irreversible", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Confirm",
        onPress: async () => {
          await apolloClient.mutate({
            mutation: DELETE_WALLET,
            variables: {
              address: wallet.address,
            },
          });
        },
      },
    ]);
  };

  if (!wallets) {
    return null;
  }

  if (!wallets.length) {
    return (
      <View>
        <Button
          title="Add Wallet"
          onPress={() => {
            navigation.navigate("NewWallet");
          }}
        />
      </View>
    );
  }


  return (
    <>
      <WalletList
        wallets={wallets}
        onWalletPress={(wallet) => {
          navigation.navigate("Wallet", {
            walletAddress: wallet.address,
          });
        }}
        onWalletContext={(wallet) => {
          Haptics.selectionAsync();
          walletContextMenu.current?.open();
        }}
        onWalletDelete={onWalletDelete}
      />

      <WalletContextMenu ref={walletContextMenu} />
    </>
  );
};

export default Wallets;
