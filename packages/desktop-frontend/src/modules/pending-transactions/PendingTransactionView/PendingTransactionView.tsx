import { Buffer } from "buffer";
import { FC, useEffect, useMemo, useState } from "react";
import { View, Text, TextInput } from "react-native";
import tw from "twrnc";
import { ApolloError, gql, useApolloClient } from "@apollo/client";
import { TxnBuilderTypes } from "aptos";

import Button from "../../ui/Button";
import WalletPicker from "../../wallets/WalletPicker/WalletPicker";
import { PendingTransaction, PendingTransactionType } from "../types";
import EntryFunctionDetails from "./EntryFunctionDetails";

const {
  AccountAddress,
  EntryFunction,
  TransactionPayloadEntryFunction,
  RawTransaction,
  ChainId,
  TransactionAuthenticatorEd25519,
  Ed25519PublicKey,
  Ed25519Signature,
  SignedTransaction,
} = TxnBuilderTypes;

const GET_PENDING_TRANSACTION = gql`
  query GetPendingTransaction($id: ID!) {
    pendingTransaction(id: $id) {
      id
      type
      payload
      createdAt
      dApp {
        name
      }
    }
  }
`;

const SEND_PENDING_TRANSACTION = gql`
  mutation SendPendingTransaction(
    $pendingTransactionId: ID!
    $walletId: ID!
    $gasPrice: Int!
    $maxGasUnit: Int!
    $timeout: Int!
  ) {
    sendPendingTransaction(
      pendingTransactionId: $pendingTransactionId
      walletId: $walletId
      gasPrice: $gasPrice
      maxGasUnit: $maxGasUnit
      timeout: $timeout
    )
  }
`;

const REMOVE_PENDING_TRANSACTION = gql`
  mutation RemovePendingTransaction($pendingTransactionId: ID!) {
    removePendingTransaction(pendingTransactionId: $pendingTransactionId)
  }
`;

interface Props {
  id: string;
}

const PendingTransactionView: FC<Props> = ({ id }) => {
  const apolloClient = useApolloClient();
  const [walletId, setWalletId] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [loading, setLoading] = useState(false);

  const [gasPrice, setGasPrice] = useState<string>("200");
  const [maxGasUnit, setMaxGasUnit] = useState<string>("2000000");
  const [timeout, setTimeout] = useState<string>("10");

  const [pendingTransaction, setPendingTransaction] =
    useState<PendingTransaction>();

  useEffect(() => {
    const load = async () => {
      const res = await apolloClient.query<{
        pendingTransaction: {
          id: string;
          type: string;
          payload: string;
          createdAt: number;
          dApp: {
            name: string;
          };
        };
      }>({
        query: GET_PENDING_TRANSACTION,
        variables: { id },
      });

      const it = res.data.pendingTransaction;
      const pendingTransaction: PendingTransaction = {
        id: it.id,
        type: it.type as PendingTransactionType,
        payload: Buffer.from(it.payload, "hex"),
        createdAt: new Date(it.createdAt),
        dApp: {
          name: it.dApp.name,
        },
      };
      setPendingTransaction(pendingTransaction);
    };
    load();
  }, [id]);

  const onSend = async () => {
    setLoading(true);
    setErrorMessage(undefined);

    try {
      const res = await apolloClient.mutate<{
        sendPendingTransaction: string | null;
      }>({
        mutation: SEND_PENDING_TRANSACTION,
        variables: {
          pendingTransactionId: id,
          gasPrice: parseInt(gasPrice, 10),
          maxGasUnit: parseInt(maxGasUnit, 10),
          walletId,
          timeout: parseInt(timeout, 10),
        },
      });

      const transactionHash = res.data?.sendPendingTransaction;
      console.log(`transactionHash = ${transactionHash}`);
    } catch (error) {
      if (error instanceof ApolloError) {
        setErrorMessage(error.message);
      } else {
        throw error;
      }
    } finally {
      setLoading(false);
    }
  };

  const onRemove = async () => {
    await apolloClient.mutate({
      mutation: REMOVE_PENDING_TRANSACTION,
      variables: {
        pendingTransactionId: id,
      },
    });
  };

  if (!pendingTransaction) {
    return null;
  }

  return (
    <View style={tw.style("flex-1 p-3")}>
      <View style={tw.style("flex-1")}>
        <WalletPicker value={walletId} onChange={setWalletId} />

        <View>
          <View style={tw.style("pt-2")}>
            <View>
              <Text style={tw`text-sm font-medium text-gray-900`}>
                Max gas unit to spend
              </Text>
            </View>
            <View>
              <TextInput
                keyboardType="number-pad"
                inputMode="numeric"
                value={maxGasUnit}
                onChangeText={setMaxGasUnit}
                onBlur={() => {
                  let num = Math.floor(parseFloat(maxGasUnit));
                  if (Number.isNaN(num) || num <= 0) {
                    num = 2000000;
                  }
                  const strNum = num.toString();
                  if (strNum !== gasPrice) {
                    setMaxGasUnit(strNum);
                  }
                }}
              />
            </View>
          </View>

          <View style={tw.style("pt-2")}>
            <View>
              <Text style={tw`text-sm font-medium text-gray-900`}>
                Gas price per unit
              </Text>
            </View>
            <View>
              <TextInput
                keyboardType="number-pad"
                inputMode="numeric"
                value={gasPrice}
                onChangeText={setGasPrice}
                onBlur={() => {
                  let num = Math.floor(parseFloat(gasPrice));
                  if (Number.isNaN(num) || num <= 0) {
                    num = 200;
                  }
                  const strNum = num.toString();
                  if (strNum !== gasPrice) {
                    setGasPrice(strNum);
                  }
                }}
              />
            </View>
          </View>

          <View style={tw.style("pt-2")}>
            <View>
              <Text style={tw`text-sm font-medium text-gray-900`}>
                Timeout (in seconds)
              </Text>
            </View>
            <View>
              <TextInput
                keyboardType="number-pad"
                inputMode="numeric"
                value={timeout}
                onChangeText={setTimeout}
                onBlur={() => {
                  let num = Math.floor(parseFloat(timeout));
                  if (Number.isNaN(num) || num <= 0) {
                    num = 10;
                  }
                  const strNum = num.toString();
                  if (strNum !== timeout) {
                    setTimeout(strNum);
                  }
                }}
              />
            </View>
          </View>

          <View style={tw.style("pt-2")}>
            <View>
              <Text style={tw`text-sm font-medium text-gray-900`}>
                Function
              </Text>
            </View>

            <EntryFunctionDetails payload={pendingTransaction.payload} />
          </View>
        </View>
      </View>
      <View>
        {loading && <Text>Loading...</Text>}
        {errorMessage && <Text>{errorMessage}</Text>}

        <Button style={tw.style("mb-2")} onPress={onSend}>
          Send
        </Button>
        <Button onPress={onRemove}>Remove</Button>
      </View>
    </View>
  );
};

export default PendingTransactionView;
