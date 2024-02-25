import { useEffect, useState } from "react";
import _ from "lodash";
import { gql, useApolloClient, useSubscription } from "@apollo/client";

export interface Wallet {
  id: string;
  label: string;
  publicKey: string;
  authenticationKey: string;
  accountAddress: string;
}

const GET_WALLETS = gql`
  query GetWallets {
    wallets {
      id
      label
      publicKey
      authenticationKey
      accountAddress
    }
  }
`;

const NEW_WALLET_SUBSCRIPTION = gql`
  subscription OnWalletAdded {
    walletAdded {
      id
      label
      publicKey
      authenticationKey
      accountAddress
    }
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
    }
  }
`;

export const useWallets = () => {
  const apolloClient = useApolloClient();
  const [wallets, setWallets] = useState<Wallet[]>([]);

  useSubscription<{ walletAdded: Wallet }>(NEW_WALLET_SUBSCRIPTION, {
    onData: (res) => {
      if (!res.data.data) {
        return;
      }
      const newWallet = res.data.data.walletAdded;
      if (newWallet) {
        setWallets((prev) => [...prev, newWallet]);
      }
    },
  });

  useSubscription<{ walletRemoved: string }>(WALLET_REMOVED_SUBSCRIPTION, {
    onData: (res) => {
      if (!res.data.data) {
        return;
      }
      const walletId = res.data.data.walletRemoved;
      if (walletId !== undefined) {
        setWallets((wallets) =>
          wallets.filter((wallet) => wallet.id !== walletId)
        );
      }
    },
  });

  useSubscription<{ walletUpdated: Wallet }>(WALLET_UPDATED, {
    onData: (res) => {
      if (!res.data.data) {
        return;
      }
      const wallet = res.data.data.walletUpdated;
      setWallets((wallets) => {
        const index = wallets.findIndex((it) => it.id === wallet.id);
        if (index === -1) {
          return [...wallets, wallet];
        }

        if (!_.isEqual(wallets[index], wallet)) {
          const newWallets = [...wallets];
          newWallets[index] = wallet;
          return newWallets;
        }

        return wallets;
      });
    },
  });

  useEffect(() => {
    const getWallets = async () => {
      const res = await apolloClient.query<{ wallets: Wallet[] }>({
        query: GET_WALLETS,
      });
      setWallets(res.data.wallets);
    };

    getWallets();
  }, []);

  return wallets;
};
