import { FC, useMemo } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity, SafeAreaView } from "react-native";
import {
  gql,
  useApolloClient,
  useQuery,
} from "@apollo/client";
import { StackScreenProps } from "@react-navigation/stack";
import tw from "twrnc";
import BN from "bn.js"

import { ModalStackParams } from "../params";
import RefreshIcon from "../../icons/RefreshIcon";
import Movements from "./Movements";
import {
  BlockMetadataTransaction,
  ScriptUserTransaction,
  TransactionType,
  UserTransaction,
  useMovements,
} from "../../../movements";
import Chart from "./Chart";

const GET_WALLET = gql`
  query GetWallet($id: ID!) {
    wallet(id: $id) {
      id
      label
      publicKey
      authenticationKey
      accountAddress
      slowWallet {
        unlocked
      }
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

const SYNC_WALLET = gql`
  mutation SyncWallet($id: ID!) {
    syncWallet(id: $id)
  }
`;

const WalletScreen: FC<StackScreenProps<ModalStackParams, "Wallet">> = ({
  route,
  navigation,
}) => {
  const { walletId } = route.params;
  const apolloClient = useApolloClient();
  const { movements } = useMovements(walletId);

  const histData = useMemo(() => {
    const histBalance: { value: number; date: Date }[] = [];

    if (movements) {
      for (const movement of movements) {
        const { transaction, balance } = movement;

        if (transaction.type !== TransactionType.Genesis) {
          const date = new Date(
            (
              transaction as
                | UserTransaction
                | ScriptUserTransaction
                | BlockMetadataTransaction
            ).timestamp
              .div(new BN(1e3))
              .toNumber()
          );

          histBalance.push({
            date,
            value: balance.toNumber()
          });
        }
      }
    }

    return histBalance;
  }, [movements]);

  const { data, error, loading } = useQuery<{
    wallet: {
      id: string;
      label: string;
      publicKey: string;
      accountAddress: string;
      authenticationKey: string;
      slowWallet: {
        unlocked: string;
      };
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

  const onRefresh = async () => {
    await apolloClient.mutate({
      mutation: SYNC_WALLET,
      variables: {
        id: walletId,
      }
    });
  };

  let unlockedAmountLabel = "---";
  let lockedAmountLabel: string | undefined;

  let lockedAmount: number | undefined;
  let unlockedAmount: number | undefined;

  if (data?.wallet) {
    const wallet = data.wallet;

    if (wallet.balances.length) {
      const libraBalance = wallet.balances.find((it) => it.coin.symbol === 'LIBRA');
      if (libraBalance) {
        let amount = parseInt(libraBalance.amount, 10);

        if (wallet.slowWallet) {
          unlockedAmount = parseInt(wallet.slowWallet.unlocked, 10);
          lockedAmount = (amount - unlockedAmount) / 1e6;
        } else {
          unlockedAmount = amount;
        }
        unlockedAmount /= 1e6;
      }
    }
  }

  if (unlockedAmount !== undefined) {
    unlockedAmountLabel = `Ƚ ${unlockedAmount.toLocaleString()}`;
  }
  if (lockedAmount !== undefined) {
    lockedAmountLabel = `${lockedAmount.toLocaleString()}`;
  }

  if (data) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={tw.style("px-3 pt-2")}>
          <View style={tw.style("flex-row items-center justify-between")}>
            <Text style={tw.style("font-semibold text-gray-900 text-xl")}>
              {`${data.wallet.label}`}
            </Text>
            <TouchableOpacity style={tw.style("p-2 pr-0")} onPress={onRefresh}>
              <RefreshIcon color="#000000" />
            </TouchableOpacity>
          </View>

          <View
            style={tw.style(
              { height: 250 },
              "bg-white rounded-md my-2 overflow-hidden"
            )}
          >
            {histData.length > 0 && (
              <Chart data={histData} />
            )}
            {/* <HistoricalBalance /> */}
          </View>

          <View style={tw.style("bg-white p-2 rounded-md my-2")}>
            <Text style={tw.style("font-medium text-gray-400 leading-6")}>
              Current Balance
            </Text>
            <Text>
              <Text style={tw.style("font-semibold text-gray-900 text-xl")}>
                {unlockedAmountLabel}
              </Text>
              {lockedAmountLabel !== undefined && (
                <Text style={tw.style("font-medium text-gray-500 text-sm")}>
                  {` / ${lockedAmountLabel}`}
                </Text>
              )}
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
                  "w-full justify-center items-center p-2 rounded-md mr-2",
                  "bg-white"
                )}
                onPress={() => {
                  navigation.navigate("NewTransfer", { walletId });
                }}
              >
                <Text
                  style={tw.style("font-semibold text-slate-900 text-base")}
                >
                  Send
                </Text>
              </TouchableOpacity>
            </View>

            <View style={tw.style("basis-1/2 justify-center items-center")}>
              <TouchableOpacity
                style={tw.style(
                  "w-full justify-center items-center p-2 rounded-md ml-2",
                  "bg-slate-950"
                )}
                onPress={() => {
                  navigation.navigate("WalletDetails", {
                    walletAddress: data.wallet.accountAddress,
                  });
                }}
              >
                <Text style={tw.style("font-semibold text-white text-base")}>
                  Receive
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <Movements movements={movements ?? []} />
      </SafeAreaView>
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
