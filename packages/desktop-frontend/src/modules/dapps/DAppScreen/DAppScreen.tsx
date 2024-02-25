import { FC, useEffect, useState } from "react";
import { View, Text } from "react-native";
import tw from "twrnc";
import { gql, useApolloClient } from "@apollo/client";

import { useWallets } from "../../wallets/hook";
import { useDApp } from "../hook";
import ConnectionRequestsList from "./ConnectionRequestsList";
import { ConnectionRequest } from "../types";
import WalletPicker from "../../wallets/WalletPicker/WalletPicker";

const APPROVE_CONNECTION_REQUEST = gql`
  mutation ApproveConnectionRequest(
    $connectionRequestId: ID!,
    $walletId: ID!,
  ) {
    approveConnectionRequest(
      connectionRequestId: $connectionRequestId,
      walletId: $walletId
    )
  }
`;

const DENY_CONNECTION_REQUEST = gql`
  mutation DenyConnectionRequest($connectionRequestId: ID!) {
    denyConnectionRequest(connectionRequestId: $connectionRequestId)
  }
`;

interface Props {
  dAppId: string;
}

const DAppScreen: FC<Props> = ({ dAppId }) => {
  const apolloClient = useApolloClient();
  const dApp = useDApp(dAppId);
  const wallets = useWallets();
  const [selectedWallet, setSelectedWallet] = useState<string>();

  useEffect(() => {
    if (wallets.length && !selectedWallet) {
      setSelectedWallet(wallets[0].id);
    }
  }, [wallets]);

  if (!dApp) {
    return null;
  }

  const onApproveRequest = async (request: ConnectionRequest) => {
    if (!selectedWallet) {
      return;
    }

    await apolloClient.mutate({
      mutation: APPROVE_CONNECTION_REQUEST,
      variables: {
        connectionRequestId: request.id,
        walletId: selectedWallet,
      },
    });
  };

  const onDenyRequest = async (request: ConnectionRequest) => {
    await apolloClient.mutate({
      mutation: DENY_CONNECTION_REQUEST,
      variables: {
        connectionRequestId: request.id,
      },
    });
  };

  return (
    <View style={tw.style("p-3")}>
      <Text style={tw.style("text-base font-semibold leading-6 text-gray-900")}>
        {dApp.name}
      </Text>
      <View style={tw.style("pt-2")}>
        <WalletPicker
          value={selectedWallet}
          onChange={(value) => setSelectedWallet(value)}
        />

        <ConnectionRequestsList
          connectionRequests={dApp.connectionRequests}
          onApprove={onApproveRequest}
          onDeny={onDenyRequest}
        />
      </View>
    </View>
  );
};

export default DAppScreen;
