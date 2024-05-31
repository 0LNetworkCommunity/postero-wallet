import { gql, useQuery, useSubscription } from "@apollo/client";
import { View, Text, Linking } from "react-native";
import { PendingTransaction, PendingTransactionStatus } from "./types";
import { useState } from "react";
import { Button } from "@postero/ui";
import { Countdown } from "../../ui/Countdown";

const PENDING_TRANSACTION_SUBSCRIPTION = gql`
  subscription PendingTransaction($id: ID!) {
    pendingTransaction(id: $id) {
      id
      hash
      status
      expirationTimestamp

      transaction {
        __typename
        version

        ... on UserTransaction {
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

const GET_PENDING_TRANSACTION = gql`
  query GetPendingTransaction($id: ID!) {
    pendingTransaction(id: $id) {
      id
      hash
      status
      expirationTimestamp

      transaction {
        __typename
        version

        ... on UserTransaction {
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

interface Props {
  id: string;
}

export function PendingTransactionState({ id }: Props) {
  const [pendingTransaction, setPendingTransaction] =
    useState<PendingTransaction>();

  useSubscription<{
    pendingTransaction: PendingTransaction;
  }>(PENDING_TRANSACTION_SUBSCRIPTION, {
    onData: (res) => {
      console.log('FE', res);

      if (!res.data.data) {
        return;
      }

      setPendingTransaction(res.data.data.pendingTransaction);
    },
    onError(error) {
      console.error(error);
    },
    variables: {
      id,
    },
  });

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
      id,
    },
  });

  if (!pendingTransaction) {
    return null;
  }

  return (
    <View>
      <Text>
        {`hash = `}
        <Text selectable>{pendingTransaction.hash}</Text>
      </Text>
      <Text>{`status = ${pendingTransaction.status}`}</Text>
      {pendingTransaction.status === PendingTransactionStatus.Unknown && (
        <Text>
          {`expires in = `}
          <Countdown
            date={new Date(pendingTransaction.expirationTimestamp * 1e3)}
          />
        </Text>
      )}

      {pendingTransaction.transaction && (
        <>
          {pendingTransaction.transaction.__typename === "UserTransaction" && (
            <View>
              <Text>{`func = ${pendingTransaction.transaction.moduleAddress}::${pendingTransaction.transaction.moduleName}::${pendingTransaction.transaction.functionName}`}</Text>
              <Text>{`version = ${pendingTransaction.transaction.version}`}</Text>
              <Button
                title="View in explorer"
                onPress={() => {
                  Linking.openURL(
                    `https://0l.fyi/transactions/${pendingTransaction.transaction!.version}`
                  );
                }}
              />
            </View>
          )}
        </>
      )}
    </View>
  );
}
