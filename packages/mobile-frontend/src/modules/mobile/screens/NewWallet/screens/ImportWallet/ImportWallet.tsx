import { useState } from "react";
import { View, Text, TextInput } from "react-native";
import tw from "twrnc";
import { gql, useApolloClient } from "@apollo/client";

import { Button } from "@postero/ui";
import { StackScreenProps } from "@react-navigation/stack";
import { NewWalletStackParams } from "../../params";

const IMPORT_WALLET = gql`
  mutation ImportWallet($mnemonic: String!) {
    importWallet(mnemonic: $mnemonic)
  }
`;

function ImportWallet({
  navigation,
}: StackScreenProps<NewWalletStackParams, "ImportWallet">) {
  const [mnemonic, setMnemonic] = useState("");
  const apolloClient = useApolloClient();

  const onImportWallet = async () => {
    await apolloClient.mutate({
      mutation: IMPORT_WALLET,
      variables: {
        mnemonic,
      },
    });
    setMnemonic("");
    navigation.pop();
  };

  return (
    <View>
      <Text>Import wallet</Text>

      <TextInput
        style={tw.style("border")}
        value={mnemonic}
        secureTextEntry
        onChangeText={setMnemonic}
      />
      <Button title="Import Wallet" onPress={onImportWallet} />
    </View>
  );
}

export default ImportWallet;
