import { FC } from "react";
import { View, ScrollView } from "react-native";
import tw from "twrnc";
import { Wallet, useWallets } from "../hook";
import ListItem from "./ListItem";
import { gql, useApolloClient } from "@apollo/client";

const OPEN_WALLET_WINDOW_MUTATION = gql`
  mutation OpenWalletWindow($id: ID!) {
    openWalletWindow(id: $id)
  }
`;

interface Props {
  activeWalletId?: string;
  onWalletPress: (id: string) => void;
}

const WalletList: FC<Props> = ({ activeWalletId: activeWalletAddress, onWalletPress }) => {
  const apolloClient = useApolloClient();
  const wallets = useWallets();

  if (!wallets.length) {
    return <View />;
  }

  const onDoubleClick = async (wallet: Wallet) => {
    await apolloClient.mutate({
      mutation: OPEN_WALLET_WINDOW_MUTATION,
      variables: {
        address: wallet.address,
      }
    });
  };

  return (
    <View style={tw`flex-1`}>
      <ScrollView>
        {wallets.map((wallet) => (
          <ListItem
            key={wallet.address}
            onPress={() => {
              onWalletPress(wallet.address);
            }}
            onDoubleClick={() => onDoubleClick(wallet)}
            wallet={wallet}
            active={activeWalletAddress === wallet.address}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default WalletList;
