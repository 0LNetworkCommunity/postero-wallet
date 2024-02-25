import { FC } from "react";
import { useNavigation } from "@react-navigation/native";
import { useApolloClient, gql } from "@apollo/client";
import { useWallets } from "./hook";
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

  return (
    <WalletList
      wallets={wallets}
      onWalletPress={(wallet) => {
        navigation.navigate("Wallet", {
          walletId: wallet.id,
        });
      }}
      onWalletDelete={async (wallet) => {
        await apolloClient.mutate({
          mutation: DELETE_WALLET,
          variables: {
            id: wallet.id,
          }
        });
      }}
    />
  );
};

export default Wallets;
