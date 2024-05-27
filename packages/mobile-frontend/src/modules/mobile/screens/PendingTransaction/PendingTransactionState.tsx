import { gql, useQuery, useSubscription } from "@apollo/client";
import { View, Text } from "react-native";
import { PendingTransaction, PendingTransactionStatus } from "./types";
import { useState } from "react";
import { Countdown } from "../../../ui/Countdown";

const PENDING_TRANSACTION_SUBSCRIPTION = gql`
  subscription PendingTransaction($id: ID!) {
    pendingTransaction(id: $id) {
      id
      hash
      status
      expirationTimestamp
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
    }
  }
`;

interface Props {
  id: string;
}


export function PendingTransactionState({ id }: Props) {
  const [pendingTransaction, setPendingTransaction] = useState<PendingTransaction>();

  useSubscription<{
    pendingTransaction: PendingTransaction;
  }>(PENDING_TRANSACTION_SUBSCRIPTION, {
    onData: (res) => {
      console.log('>>>', res);

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

  return (
    <View>
      {pendingTransaction && (
        <>
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
        </>
      )}
    </View>
  );
}
