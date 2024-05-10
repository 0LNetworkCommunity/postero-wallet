import * as Crypto from "expo-crypto";
import { useEffect, useState } from "react";
import { ActivityIndicator, SafeAreaView, View, Text } from "react-native";
import { LangEn, Mnemonic } from "ethers";
import { Button } from "@postero/ui";
import { gql, useApolloClient } from "@apollo/client";

const CREATE_KEY_FROM_MNEMONIC = gql`
  mutation CreateKeyFromMnemonic($mnemonic: String!) {
    createKeyFromMnemonic(mnemonic: $mnemonic)
  }
`;

const createMnemonic = () => {
  const rand = Crypto.getRandomBytes(32);
  const wordlist = LangEn.wordlist();
  const mnemonic = Mnemonic.fromEntropy(rand, "", wordlist);
  return mnemonic.phrase;
};

function MnemonicScreen() {
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
      await apolloClient.mutate({
        mutation: CREATE_KEY_FROM_MNEMONIC,
        variables: {
          mnemonic,
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
      <View>
        <Text>{mnemonic}</Text>
      </View>

      <Button title="Continue" onPress={() => saveMnemonic()} />
    </SafeAreaView>
  );
}

export default MnemonicScreen;
