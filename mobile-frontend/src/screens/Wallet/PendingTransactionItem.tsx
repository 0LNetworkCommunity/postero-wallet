import { useMemo, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Text } from "@postero/ui";
import tw from "twrnc";
import { gql, useApolloClient, useQuery, useSubscription } from "@apollo/client";
import { PendingTransaction, PendingTransactionStatus } from "../Transaction/types";
import { Countdown } from "../../ui/Countdown";

const GET_PENDING_TRANSACTION = gql`
  query GetPendingTransaction($hash: Bytes!) {
    pendingTransaction(hash: $hash) {
      hash
      status
      expirationTimestamp
      updating
      createdAt

      transaction {
        __typename
        hash

        ... on UserTransaction {
          version
          success
          moduleName
          moduleAddress
          functionName
          sender
          hash
          arguments
          timestamp
        }
      }
    }
  }
`;

const PENDING_TRANSACTION_SUBSCRIPTION = gql`
  subscription PendingTransaction($hash: Bytes!) {
    pendingTransaction(hash: $hash) {
      hash
      status
      expirationTimestamp
      updating
      createdAt

      transaction {
        __typename
        hash

        ... on UserTransaction {
          version
          success
          moduleName
          moduleAddress
          functionName
          sender
          hash
          arguments
          timestamp
        }
      }
    }
  }
`;

const dateTimeFormatter = new Intl.DateTimeFormat("fr-FR", {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  hour12: false,
});

interface Props {
  hash: Uint8Array;
}

export function PendingTransactionItem({ hash }: Props) {
  const [pendingTransaction, setPendingTransaction] =
    useState<PendingTransaction>();

  useQuery<{
    pendingTransaction: PendingTransaction;
  }>(GET_PENDING_TRANSACTION, {
    onCompleted(data) {
      setPendingTransaction(data.pendingTransaction);
    },
    onError(error) {
      console.error(error);
    },
    variables: {
      hash: Buffer.from(hash).toString("hex"),
    },
  });

  useSubscription<{
    pendingTransaction: PendingTransaction;
  }>(PENDING_TRANSACTION_SUBSCRIPTION, {
    onData: (res) => {
      if (!res.data.data) {
        return;
      }

      setPendingTransaction(res.data.data.pendingTransaction);
    },
    onError(error) {
      console.error(error);
    },
    variables: {
      hash: Buffer.from(hash).toString("hex"),
    },
  });

  const dateLabel = useMemo(() => {
    if (!pendingTransaction) {
      return "";
    }
    return dateTimeFormatter.format(
      new Date(pendingTransaction.createdAt)
    );
  }, [pendingTransaction?.createdAt]);

  if (pendingTransaction) {
    return (
      <View style={tw.style("py-2 px-3 h-16 flex-col justify-between")}>
        <Text>{pendingTransaction.status}</Text>
        {pendingTransaction.status === PendingTransactionStatus.Unknown && (
          <Text>
            {`expires in = `}
            <Countdown
              date={new Date(pendingTransaction.expirationTimestamp * 1e3)}
            />
          </Text>
        )}

        <View style={tw.style("flex-row justify-between")}>
          <View style={tw.style("pt-1 pr-2")}>
            <Text style={tw.style("text-xs text-gray-500")}>{dateLabel}</Text>
          </View>
        </View>
      </View>
    );
  }

  return <View style={tw.style("py-2 px-3 h-16 flex-col justify-between")} />;
}
