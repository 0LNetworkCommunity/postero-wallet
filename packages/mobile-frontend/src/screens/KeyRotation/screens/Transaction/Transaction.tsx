import { useState } from "react";
import { gql, useApolloClient } from "@apollo/client";
import { CompositeScreenProps } from "@react-navigation/native";
import { ActivityIndicator, SafeAreaView, Text, View } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";

import { Button } from "@postero/ui";
import { KeyRotationRoutes } from "../../Router";
import { ModalStackParams } from "../../../params";

const SEND_KEY_ROTATION_TRANSACTION = gql`
  mutation SendKeyRotationTransaction(
    $address: Bytes!,
    $newPublicKey: Bytes!
  ) {
    sendKeyRotationTransaction(
      address: $address,
      newPublicKey: $newPublicKey
    )
  }
`;

function TransactionScreen({
  navigation,
  route,
}: CompositeScreenProps<
  StackScreenProps<KeyRotationRoutes, "Transaction">,
  StackScreenProps<ModalStackParams>
>) {
  const apolloClient = useApolloClient();
  const [loading, setLoading] = useState(false);

  const { publicKey, address } = route.params;
  console.log('variables', {
    address,
    newPublicKey: publicKey,
  });
  const sendTransaction = async () => {
    setLoading(true);
    try {
      const res = await apolloClient.mutate<{
        sendKeyRotationTransaction: boolean;
      }>({
        mutation: SEND_KEY_ROTATION_TRANSACTION,
        variables: {
          address,
          newPublicKey: publicKey,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text>{`Address: ${address}`}</Text>
      <Text>{`Public key: ${publicKey}`}</Text>

      <Button title="Send transaction" onPress={() => sendTransaction()} />
    </SafeAreaView>
  );
}

export default TransactionScreen;
