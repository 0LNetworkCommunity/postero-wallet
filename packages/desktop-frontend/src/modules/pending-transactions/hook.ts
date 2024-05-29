import { Buffer } from "buffer";
import { gql, useSubscription } from "@apollo/client";
import { useEffect, useState } from "react";

import apolloClient from "../backend/apollo-client";
import {
  RawPendingTransaction,
  PendingTransaction,
  PendingTransactionType,
} from "./types";

const GET_PENDING_TRANSACTIONS = gql`
  query GetPendingTransactions {
    pendingTransactions {
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

const NEW_PENDING_TRANSACTION = gql`
  subscription NewPendingTransaction {
    newPendingTransaction {
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

const PENDING_TRANSACTION_REMOVED = gql`
  subscription PendingTransactionRemoved {
    pendingTransactionRemoved
  }
`;

const pendingTransactionMapper = (
  rawPendingTransaction: RawPendingTransaction
): PendingTransaction => {
  return {
    id: rawPendingTransaction.id,
    type: rawPendingTransaction.type as PendingTransactionType,
    payload: Buffer.from(rawPendingTransaction.payload, "hex"),
    createdAt: new Date(rawPendingTransaction.createdAt),
    dApp: {
      name: rawPendingTransaction.dApp.name,
    },
  };
};

export const getPendingTransactions = async (): Promise<
  PendingTransaction[]
> => {
  const res = await apolloClient.query<{
    pendingTransactions: RawPendingTransaction[];
  }>({
    query: GET_PENDING_TRANSACTIONS,
  });
  return res.data.pendingTransactions.map((it) => pendingTransactionMapper(it));
};

export const usePendingTransactions = (): PendingTransaction[] => {
  const [pendingTransactions, setPendingTransactions] = useState<
    PendingTransaction[]
  >([]);

  useSubscription<{ newPendingTransaction: RawPendingTransaction }>(
    NEW_PENDING_TRANSACTION,
    {
      onData: (res) => {
        if (!res.data.data) {
          return;
        }
        const newPendingTransaction = pendingTransactionMapper(
          res.data.data.newPendingTransaction
        );
        setPendingTransactions((prev) => [newPendingTransaction, ...prev]);
      },
    }
  );

  useSubscription<{ pendingTransactionRemoved: string }>(
    PENDING_TRANSACTION_REMOVED,
    {
      onData: (res) => {
        if (!res.data.data) {
          return;
        }
        const pendingTransactionId = res.data.data.pendingTransactionRemoved;
        setPendingTransactions((prev) => {
          return prev.filter((it) => it.id !== pendingTransactionId);
        });
      },
    }
  );

  useEffect(() => {
    const load = async () => {
      const pendingTransactions = await getPendingTransactions();
      setPendingTransactions(pendingTransactions);
    };
    load();
  }, []);

  return pendingTransactions;
};
