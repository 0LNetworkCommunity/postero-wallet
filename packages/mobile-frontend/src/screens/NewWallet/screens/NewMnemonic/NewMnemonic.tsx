import { useEffect, useState } from "react";
import * as Crypto from "expo-crypto";
import { View, ActivityIndicator } from "react-native";
import { LangEn, Mnemonic } from "ethers";
import { StackScreenProps } from "@react-navigation/stack";
import { gql, useApolloClient } from "@apollo/client";
import { WalletCreation } from "@postero/ui";

import { NewWalletStackParams } from "../../params";
import { CompositeScreenProps } from "@react-navigation/native";
import { KeyRotationRoutes } from "../../../KeyRotation/Router";
import { ModalStackParams } from "../../../params";

const NEW_WALLET_FROM_MNEMONIC = gql`
  mutation NewWalletFromMnemonic($mnemonic: String!) {
    newWalletFromMnemonic(mnemonic: $mnemonic) {
      label
      address
    }
  }
`;

const createMnemonic = () => {
  const rand = Crypto.getRandomBytes(32);
  const wordlist = LangEn.wordlist();
  const mnemonic = Mnemonic.fromEntropy(rand, "", wordlist);
  return mnemonic.phrase;
};

function NewMnemonic({
  navigation,
  route,
}: CompositeScreenProps<
  StackScreenProps<NewWalletStackParams, "NewMnemonic">,
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
        newWalletFromMnemonic: {
          label: string;
          address: string;
        };
      }>({
        mutation: NEW_WALLET_FROM_MNEMONIC,
        variables: {
          mnemonic,
        },
      });

      console.log("res", res);
      if (res.data) {
        navigation.navigate("Wallet", {
          walletAddress: res.data.newWalletFromMnemonic.address,
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
    <WalletCreation.MnemonicScreen
      mnemonic={mnemonic}
      onBack={() => navigation.pop()}
      onContinue={() => saveMnemonic()}
    />
  );
}

export default NewMnemonic;
