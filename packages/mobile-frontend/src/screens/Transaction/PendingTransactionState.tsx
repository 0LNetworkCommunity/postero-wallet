import {
  gql,
  useApolloClient,
  useQuery,
  useSubscription,
} from "@apollo/client";
import { View, Text, Linking, StyleSheet, TouchableOpacity } from "react-native";
import { useState } from "react";

import { Button } from "@postero/ui";

import { PendingTransaction, PendingTransactionStatus } from "./types";
import { Countdown } from "../../ui/Countdown";

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
          arguments
          timestamp
        }
      }
    }
  }
`;

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
          success
          version
          moduleName
          moduleAddress
          functionName
          sender
          arguments
          timestamp
        }
      }
    }
  }
`;

const UPDATE_PENDING_TRANSACTION = gql`
  mutation UpdatePendingTransaction($hash: Bytes!) {
    updatePendingTransaction(hash: $hash)
  }
`;

interface Props {
  hash: Uint8Array;
}

export function PendingTransactionState({ hash }: Props) {
  const apolloClient = useApolloClient();
  const [pendingTransaction, setPendingTransaction] =
    useState<PendingTransaction>();

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

  if (!pendingTransaction) {
    return null;
  }

  return (
    <View style={{ paddingHorizontal: 5 }}>
      <View style={styles.propertyContainer}>
        <Text style={styles.label}>Type</Text>
        <Text>Pending transaction</Text>
      </View>

      <View style={styles.separator} />

      <TouchableOpacity
        onPress={() => {
          Linking.openURL(
            `https://rpc.0l.fyi/v1/transactions/by_hash/0x${pendingTransaction.hash}`
          );
        }}
      >
        <View style={styles.propertyContainer}>
          <Text style={styles.label}>Hash</Text>
          <Text>{pendingTransaction.hash}</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.separator} />

      <View style={styles.propertyContainer}>
        <Text style={styles.label}>Status</Text>
        <Text>{pendingTransaction.status}</Text>
      </View>

      <View style={styles.separator} />

      {pendingTransaction.status === PendingTransactionStatus.Unknown && (
        <View style={styles.propertyContainer}>
          <Text style={styles.label}>Expires in</Text>
          <Countdown
            date={new Date(pendingTransaction.expirationTimestamp * 1e3)}
          />
        </View>
      )}

      <View style={styles.separator} />

      <View style={styles.propertyContainer}>
        <Text style={styles.label}>Updating</Text>
        <Text>{`${pendingTransaction.updating}`}</Text>
      </View>

      <View style={styles.separator} />

      <View style={styles.propertyContainer}>
        <Text style={styles.label}>Created At</Text>
        <Text>{new Date(pendingTransaction.createdAt).toISOString()}</Text>
      </View>

      <View style={styles.separator} />

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

      <Button
        title="Refresh"
        onPress={async () => {
          await apolloClient.mutate({
            mutation: UPDATE_PENDING_TRANSACTION,
            variables: {
              hash: pendingTransaction.hash,
            },
          });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  propertyContainer: {
    paddingVertical: 10,
  },
  label: {
    color: "rgb(113, 113, 122)",
    marginBottom: 5,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    width: "100%",
    backgroundColor: "rgba(9, 9, 11, 0.05)",
  },
});
