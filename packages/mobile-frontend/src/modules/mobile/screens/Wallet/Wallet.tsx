import { FC } from "react";
import { View, Text, ActivityIndicator, Button } from "react-native";
import {
  gql,
  useApolloClient,
  useQuery,
  useSubscription,
} from "@apollo/client";
import { StackScreenProps } from "@react-navigation/stack";
import tw from "twrnc";
import { ModalStackParams } from "../params";

const GET_WALLET = gql`
  query GetWallet($id: ID!) {
    wallet(id: $id) {
      id
      label
      publicKey
      authenticationKey
      accountAddress
    }
  }
`;

//      balances {
//        amount
//        coin {
//          id
//          symbol
//          decimals
//        }
//      }

const WalletScreen: FC<StackScreenProps<ModalStackParams, "Wallet">> = ({
  route,
  navigation,
}) => {
  const { walletId } = route.params;

  const { data, loading } = useQuery<{
    wallet: {
      id: string;
      label: string;
      publicKey: string;
      accountAddress: string;
      authenticationKey: string;
    };
  }>(GET_WALLET, {
    variables: {
      id: walletId,
    },
  });

  const unlocked = 8_778_733.183009;
  const balance = 23_817_187.679843;

  if (data) {
    return (
      <View style={tw.style("flex-1 p-2")}>
        <Text>{`balance = Ƚ ${balance.toLocaleString()}`}</Text>
        <Text>{`unlocked = Ƚ ${unlocked.toLocaleString()}`}</Text>
        <Text>{`label = ${data.wallet.label}`}</Text>
        <Text>{`address = ${data.wallet.accountAddress}`}</Text>
        <Button
          title="New Transfer"
          onPress={() => {
            navigation.navigate("NewTransfer", { walletId });
          }}
        />
      </View>
    );
  }

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return null;
};

export default WalletScreen;
