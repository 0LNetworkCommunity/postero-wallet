import { ReactNode, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  gql,
  useApolloClient,
} from "@apollo/client";
import tw from "twrnc";
import BN from "bn.js"
import {
  ArrowUpRightIcon,
  Button,
  ButtonSize,
  ButtonVariation,
  Download02Icon,
} from "@postero/ui";

import RefreshIcon from "../../icons/RefreshIcon";
import AdjustmentsHorizontalIcon from "../../icons/AdjustmentsHorizontalIcon";
import Movements from "./Movements";
import {
  BlockMetadataTransaction,
  ScriptUserTransaction,
  TransactionType,
  UserTransaction,
  useMovements,
} from "../../../movements";
import Chart from "./Chart";
import ChevronLeftIcon from "../../icons/ChevronLeftIcon";
import NavBar from "../../../ui/NavBar";
import { WalletLabel } from "./WalletLabel";

const GET_WALLET = gql`
  query GetWallet($address: Bytes!) {
    wallet(address: $address) {
      label
      address
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

const SET_WALLET_LABEL = gql`
  mutation SetWalletLabel($address: Bytes!, $label: String!) {
    setWalletLabel(address: $address, label: $label)
  }
`;

const SYNC_WALLET = gql`
  mutation SyncWallet($address: Bytes!) {
    syncWallet(address: $address)
  }
`;

interface Props {
  walletAddress: string;
  onPressSettings: () => void;
}

function WalletBase({ walletAddress, onPressSettings }: Props): ReactNode {
  const navigation = useNavigation<any>();
  const apolloClient = useApolloClient();
  const { movements } = useMovements(walletAddress);

  const [loading, setLoading] = useState(false);

  const [wallet, setWallet] = useState<{
    address: string;
    label: string;
    slowWallet: {
      unlocked: string;
    } | null;
    balances: {
      amount: string;
      coin: {
        id: string;
        symbol: string;
        decimals: 6;
      };
    }[];
  }>();

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
            value: balance.toNumber(),
          });
        }
      }
    }

    return histBalance;
  }, [movements]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      try {
        const { data } = await apolloClient.query<{
          wallet: {
            address: string;
            label: string;
            slowWallet: {
              unlocked: string;
            } | null;
            balances: {
              amount: string;
              coin: {
                id: string;
                symbol: string;
                decimals: 6;
              };
            }[];
          };
        }>({
          query: GET_WALLET,
          variables: {
            address: walletAddress,
          },
        });

        setWallet(data.wallet);
      } finally {
        setLoading(false);
      }
    };
    load();

  }, [walletAddress]);

  const onRefresh = async () => {
    await apolloClient.mutate({
      mutation: SYNC_WALLET,
      variables: {
        address: walletAddress,
      },
    });
  };

  let unlockedAmountLabel = "---";
  let lockedAmountLabel: string | undefined;

  let lockedAmount: number | undefined;
  let unlockedAmount: number | undefined;

  if (wallet) {
    if (wallet.balances.length) {
      const libraBalance = wallet.balances.find(
        (it) => it.coin.symbol === "LIBRA"
      );
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

  const setWalletLabel = async (label: string) => {
    setWallet((wallet) => {
      if (wallet) {
        return { ...wallet, label };
      }
    });
    await apolloClient.mutate<{ setWalletLabel: { label: string } }>({
      mutation: SET_WALLET_LABEL,
      variables: {
        label,
        address: walletAddress,
      },
    });
  };

  if (wallet) {
    return (
      <View style={tw.style("flex-1")}>
        <View style={tw.style("px-3 pt-2")}>
          <NavBar
            title={
              <WalletLabel
                value={wallet.label}
                onChange={setWalletLabel}
              />
            }
            leftActions={
              <TouchableOpacity
                style={tw.style("p-2")}
                onPress={() => navigation.goBack()}
              >
                <ChevronLeftIcon color="#000000" />
              </TouchableOpacity>
            }
            rightActions={
              <>
                <TouchableOpacity style={tw.style("p-2")} onPress={onRefresh}>
                  <RefreshIcon color="#000000" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={tw.style("p-2")}
                  onPress={onPressSettings}
                >
                  <AdjustmentsHorizontalIcon color="#000000" />
                </TouchableOpacity>
              </>
            }
          />

          <View
            style={tw.style(
              { height: 250 },
              "bg-white rounded-md my-2 overflow-hidden"
            )}
          >
            {histData.length > 0 && <Chart data={histData} />}
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
              {/* <TouchableOpacity
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
              </TouchableOpacity> */}
            </View>
          </View>

          <View
            style={tw.style({
              flexDirection: "row",
            })}
          >
            <View style={tw.style("basis-1/2 pr-1")}>
              <Button
                size={ButtonSize.MD}
                variation={ButtonVariation.Secondary}
                title="Send"
                icon={ArrowUpRightIcon}
                onPress={() => {
                  navigation.navigate("NewTransfer", { walletAddress });
                }}
              />
            </View>

            <View style={tw.style("basis-1/2 pl-1")}>
              <Button
                size={ButtonSize.MD}
                variation={ButtonVariation.Primary}
                title="Receive"
                icon={Download02Icon}
                onPress={() => {
                  navigation.navigate("WalletDetails", {
                    address: wallet.address,
                    label: wallet.label,
                  });
                }}
              />
            </View>
          </View>
        </View>

        <Movements movements={movements ?? []} />
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
}

export default WalletBase;
