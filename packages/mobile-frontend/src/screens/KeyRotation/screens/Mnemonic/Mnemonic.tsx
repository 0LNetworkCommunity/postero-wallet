import * as Crypto from "expo-crypto";
import { useEffect, useState } from "react";
import { ActivityIndicator, SafeAreaView, View, Text } from "react-native";
import { LangEn, Mnemonic } from "ethers";
import { gql, useApolloClient } from "@apollo/client";
import { CompositeScreenProps } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import * as Clipboard from 'expo-clipboard';

import { Button } from "@postero/ui";

import { KeyRotationRoutes } from "../../Router";
import { ModalStackParams } from "../../../params";

const CREATE_KEY_FROM_MNEMONIC = gql`
  mutation CreateKeyFromMnemonic($mnemonic: String!) {
    createKeyFromMnemonic(mnemonic: $mnemonic) {
      publicKey
      authKey
    }
  }
`;

const createMnemonic = () => {
  const rand = Crypto.getRandomBytes(32);
  const wordlist = LangEn.wordlist();
  const mnemonic = Mnemonic.fromEntropy(rand, "", wordlist);
  return mnemonic.phrase;
};

function MnemonicScreen({
  navigation,
  route,
}: CompositeScreenProps<
  StackScreenProps<KeyRotationRoutes, "Mnemonic">,
  StackScreenProps<ModalStackParams>
>) {
  const apolloClient = useApolloClient();
  const [mnemonic, setMnemonic] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMnemonic(createMnemonic);
  }, []);

  const saveMnemonic = async () => {
    setLoading(true);
    try {
      setMnemonic("");
      const res = await apolloClient.mutate<{
        createKeyFromMnemonic: {
          authKey: string;
          publicKey: string;
        };
      }>({
        mutation: CREATE_KEY_FROM_MNEMONIC,
        variables: {
          mnemonic,
        },
      });

      if (res.data) {
        navigation.navigate("Transaction", {
          address: route.params.address,
          publicKey: res.data.createKeyFromMnemonic.publicKey,
        });
      }
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
      <View>
        <Text>{mnemonic}</Text>
      </View>

      <Button
        title="Copy to clipboard"
        onPress={async () => {
          await Clipboard.setStringAsync(mnemonic);
        }}
      />
      <Button title="Continue" onPress={() => saveMnemonic()} />
    </SafeAreaView>
  );
}

export default MnemonicScreen;
