import _ from "lodash";
import { Buffer } from "buffer";
import { FC, useMemo } from "react";
import { View, Text } from "react-native";
import { BCS, TxnBuilderTypes } from "aptos";
import tw from "twrnc";
import { formatDistanceToNowStrict } from "date-fns";

import { PendingTransaction } from "../types";
import Countdown from "../../ui/Countdown";

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

interface Props {
  pendingTransaction: PendingTransaction;
}

const PendingTransactionListItem: FC<Props> = ({ pendingTransaction }) => {
  const entryFunctionPayload = useMemo(() => {
    const deserializer = new BCS.Deserializer(pendingTransaction.payload);
    const entryFunctionPayload = new TransactionPayloadEntryFunction(
      EntryFunction.deserialize(deserializer)
    );
    return entryFunctionPayload;
  }, [pendingTransaction.payload]);

  const moduleAddress = _.trimStart(
    Buffer.from(entryFunctionPayload.value.module_name.address.address)
      .toString("hex")
      .toUpperCase(),
    "00"
  );

  return (
    <View style={tw.style("px-3 py-2", "border-b border-gray-900/5")}>
      <View style={tw.style("flex-row justify-between")}>
        <View style={tw.style("pr-2")}>
          <Text numberOfLines={1} ellipsizeMode="middle">
            {pendingTransaction.dApp.name}
          </Text>
        </View>
        <Text numberOfLines={1} ellipsizeMode="middle">
          <Countdown>{pendingTransaction.createdAt}</Countdown>
          {" ago"}
        </Text>
      </View>
      <Text
        numberOfLines={1}
        ellipsizeMode="middle"
        style={tw.style("text-sm text-slate-900", {
          fontFamily: "mononoki-Bold",
        })}
      >
        <Text>{moduleAddress}</Text>
        <Text>::</Text>
        <Text>{entryFunctionPayload.value.module_name.name.value}</Text>
        <Text>::</Text>
        <Text>{entryFunctionPayload.value.function_name.value}</Text>
      </Text>
    </View>
  );
};

export default PendingTransactionListItem;
