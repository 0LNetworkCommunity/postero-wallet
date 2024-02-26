import { FC } from "react";
import { View, Text, ActivityIndicator, Button, Pressable, TouchableOpacity } from "react-native";
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
      balances {
        amount
        coin {
          id
          symbol
          decimals
        }
      }
    }
  }
`;

const WalletScreen: FC<StackScreenProps<ModalStackParams, "Wallet">> = ({
  route,
  navigation,
}) => {
  const { walletId } = route.params;

  const { data, error, loading } = useQuery<{
    wallet: {
      id: string;
      label: string;
      publicKey: string;
      accountAddress: string;
      authenticationKey: string;
      balances: {
        amount: string;
        coin: {
          id: string;
          symbol: string;
          decimals: 6;
        };
      }[];
    };
  }>(GET_WALLET, {
    variables: {
      id: walletId,
    },
  });

  const unlocked = 8_778_733.183009;
  let balanceLabel = "---";

  if (data?.wallet?.balances?.length) {
    const balance = data.wallet.balances[0];
    let amount = parseInt(balance.amount, 10);
    amount = amount / Math.pow(10, balance.coin.decimals);
    balanceLabel = amount.toLocaleString();
  }

  if (data) {
    return (
      <View style={tw.style("flex-1 px-3 py-4")}>
        <Text style={tw.style("font-semibold text-gray-900 text-xl")}>
          {`${data.wallet.label}`}
        </Text>

        <View style={tw.style("bg-white p-2 rounded my-2")}>
          <Text style={tw.style("font-semibold text-gray-400")}>
            Current Balance
          </Text>
          <Text style={tw.style("font-semibold text-gray-900 text-xl")}>
            {`Ƚ ${balanceLabel}`}
          </Text>
        </View>

        <View
          style={tw.style({
            flexDirection: "row",
          })}
        >
          <View style={tw.style("basis-1/2 justify-center items-center")}>
            <TouchableOpacity
              style={tw.style(
                "w-full justify-center items-center p-2 rounded mr-2",
                "bg-white"
              )}
              onPress={() => {
                navigation.navigate("NewTransfer", { walletId });
              }}
            >
              <Text style={tw.style("font-semibold text-slate-900 text-base")}>
                Send
              </Text>
            </TouchableOpacity>
          </View>

          <View style={tw.style("basis-1/2 justify-center items-center")}>
            <TouchableOpacity
              style={tw.style(
                "w-full justify-center items-center p-2 rounded ml-2",
                "bg-slate-950"
              )}
              onPress={() => {}}
            >
              <Text style={tw.style("font-semibold text-white text-base")}>
                Receive
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text>{`unlocked = Ƚ ${unlocked.toLocaleString()}`}</Text>
        <Text>{`address = ${data.wallet.accountAddress}`}</Text>
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
