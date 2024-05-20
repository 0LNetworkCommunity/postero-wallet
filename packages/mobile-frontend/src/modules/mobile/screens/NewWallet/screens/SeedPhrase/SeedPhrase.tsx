import { useEffect, useState } from "react";
import * as Crypto from "expo-crypto";
import { View, Text, ActivityIndicator } from "react-native";
import { LangEn, Mnemonic } from "ethers";
import { StackScreenProps } from "@react-navigation/stack";
import * as Clipboard from 'expo-clipboard';
import { gql, useApolloClient } from "@apollo/client";
import { Button } from "@postero/ui";

import { NewWalletStackParams } from "../../params";

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

function SeedPhrase({
  navigation,
}: StackScreenProps<NewWalletStackParams, "SeedPhrase">) {
  const apolloClient = useApolloClient();
  const [mnemonic, setMnemonic] = useState('');
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

      console.log('res', res);
      // if (res.data) {
      //   navigation.navigate('Home');
      // }
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
    <View style={{ flex: 1 }}>
      <Text>Write down your Secret Recovery Phrase</Text>

      <Text>{mnemonic}</Text>

      <Button
        title="Copy to clipboard"
        onPress={async () => {
          await Clipboard.setStringAsync(mnemonic);
        }}
      />

      <Button
        title="Continue"
        onPress={() => {
          saveMnemonic();
        }}
      />
    </View>
  );
}

export default SeedPhrase;
