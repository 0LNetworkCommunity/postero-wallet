import { FC } from "react";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useApolloClient, gql } from "@apollo/client";
import { Wallet, useWallets } from "./hook";
import WalletList from "./WalletList";

const DELETE_WALLET = gql`
  mutation DeleteWallet($id: ID!) {
    deleteWallet(id: $id)
  }
`;

const Wallets: FC = () => {
  const apolloClient = useApolloClient();
  const navigation = useNavigation<any>();
  const wallets = useWallets();

  const onWalletDelete = (wallet: Wallet) => {
    Alert.alert("Alert Title", "My Alert Msg", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "OK",
        onPress: async () => {
          await apolloClient.mutate({
            mutation: DELETE_WALLET,
            variables: {
              id: wallet.id,
            },
          });
        },
      },
    ]);
  };

  return (
    <WalletList
      wallets={wallets}
      onWalletPress={(wallet) => {
        navigation.navigate("Wallet", {
          walletId: wallet.id,
        });
      }}
      onWalletDelete={onWalletDelete}
    />
  );
};

export default Wallets;
