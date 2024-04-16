import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import * as Clipboard from 'expo-clipboard';
import { gql, useApolloClient } from "@apollo/client";
import { Button } from "@postero/ui";

import { NewWalletStackParams } from "../../params";

const NEW_WALLET = gql`
  mutation NewWallet {
    newWallet {
      id
      label
      mnemonic
    }
  }
`;

function SeedPhrase({
  navigation,
}: StackScreenProps<NewWalletStackParams, "SeedPhrase">) {
  const [loading, setLoading] = useState(false);
  const [mnemonic, setMnemonic] = useState('');
  const apolloClient = useApolloClient();

  useEffect(() => {
    const createWallet = async () => {
      try {
        setLoading(true);
        const res = await apolloClient.mutate({
          mutation: NEW_WALLET,
        });
        setMnemonic(res.data.newWallet.mnemonic);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    createWallet();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Text>Write down your Secret Recovery Phrase</Text>

      <Text>{mnemonic}</Text>

      <Button
        title="Copy to clipboard"
        onPress={async () => {
          await Clipboard.setStringAsync(mnemonic);
        }}
      />

      <Button title="I wrote it down" onPress={() => {}} />
      <Button title="I'll do this later" onPress={() => {}} />
    </View>
  );
}

export default SeedPhrase;
