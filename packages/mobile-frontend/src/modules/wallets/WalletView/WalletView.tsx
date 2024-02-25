import _ from "lodash";
import { FC, useEffect, useState } from "react";
import { Text, View } from "react-native";
import tw from "twrnc";
import { gql, useApolloClient, useSubscription } from "@apollo/client";
import EditableValue from "../../ui/EditableValue";
import Balances from "./Balances";
import { Wallet } from "../hook";

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

const SET_WALLET_LABEL = gql`
  mutation SetWalletLabel($id: ID!, $label: String!) {
    setWalletLabel(id: $id, label: $label)
  }
`;

const WALLET_REMOVED_SUBSCRIPTION = gql`
  subscription OnWalletRemoved {
    walletRemoved
  }
`;

const WALLET_UPDATED = gql`
  subscription OnWalletUpdated {
    walletUpdated {
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

interface Props {
  id: string;
}

const WalletView: FC<Props> = ({ id }) => {
  const apolloClient = useApolloClient();
  const [wallet, setWallet] = useState<Wallet>();

  useSubscription<{ walletRemoved: string }>(WALLET_REMOVED_SUBSCRIPTION, {
    onData: (res) => {
      if (!res.data.data) {
        return;
      }
      const walletId = res.data.data.walletRemoved;
      if (walletId === id) {
        setWallet(undefined);
      }
    },
  });

  useSubscription<{ walletUpdated: Wallet }>(WALLET_UPDATED, {
    onData(res) {
      if (!res.data.data) {
        return;
      }

      const { walletUpdated } = res.data.data;
      if (!walletUpdated || walletUpdated.id !== id) {
        return;
      }

      // Temp fix to avoid render loop as getWallet query calls
      // wallet sync which trigger this sub
      if (!_.isEqual(walletUpdated, wallet)) {
        setWallet(walletUpdated);
      }
    },
  });

  useEffect(() => {
    const getWallet = async () => {
      const res = await apolloClient.query<{ wallet: Wallet }>({
        query: GET_WALLET,
        variables: { id },
      });
      setWallet(res.data.wallet);
    };

    getWallet();
  }, [id]);

  if (!wallet) {
    return null;
  }

  return (
    <View style={tw.style("px-3 py-3")}>
      <View>
        <View style={tw.style("pb-2")}>
          <EditableValue
            style={tw.style("text-lg font-bold")}
            value={wallet.label}
            placeholder="Wallet Name"
            onChange={async (value) => {
              await apolloClient.mutate({
                mutation: SET_WALLET_LABEL,
                variables: {
                  id,
                  label: value,
                },
              });
            }}
          />
        </View>

        <View style={tw.style("pb-2")}>
          <View style={tw.style("pb-1")}>
            <Text style={tw`text-sm font-medium text-gray-900`}>Address</Text>
          </View>
          <Text
            style={tw.style(`text-sm text-gray-700`, {
              fontFamily: "mononoki-Regular",
              userSelect: "text",
            })}
          >
            {wallet.accountAddress}
          </Text>
        </View>
      </View>

      {(wallet as any).balances.length > 0 && (
        <Balances balances={(wallet as any).balances} />
      )}
    </View>
  );
};

export default WalletView;
