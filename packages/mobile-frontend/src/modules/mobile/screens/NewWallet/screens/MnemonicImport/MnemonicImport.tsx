import { useState } from "react";
import { View, TextInput, ActivityIndicator, TouchableOpacity, SafeAreaView } from "react-native";
import tw from "twrnc";
import { gql, useApolloClient } from "@apollo/client";
import * as Clipboard from 'expo-clipboard';

import { Button } from "@postero/ui";
import { StackScreenProps } from "@react-navigation/stack";
import { NewWalletStackParams } from "../../params";
import ClipboardDocumentListIcon from "../../../../icons/ClipboardDocumentListIcon";
import { CompositeScreenProps } from "@react-navigation/native";
import { ModalStackParams } from "../../../params";

const IMPORT_MNEMONIC = gql`
  mutation ImportMnemonic($mnemonic: String!) {
    importMnemonic(mnemonic: $mnemonic)
  }
`;

function MnemonicImport({
  navigation,
}: CompositeScreenProps<
  StackScreenProps<NewWalletStackParams, "MnemonicImport">,
  StackScreenProps<ModalStackParams>
>) {
  const [mnemonic, setMnemonic] = useState("");
  const [loading, setLoading] = useState(false);
  const apolloClient = useApolloClient();

  const onSeedPhraseImport = async () => {
    if (!mnemonic) {
      return;
    }

    setLoading(true);
    try {
      setMnemonic("");
      await apolloClient.mutate({
        mutation: IMPORT_MNEMONIC,
        variables: {
          mnemonic,
        },
      });
      navigation.navigate("Main");
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
      <View style={{ flex: 1, padding: 16 }}>
        <View style={{ flex: 1 }}>
          <TextInput
            style={tw.style("border")}
            value={mnemonic}
            secureTextEntry
            onChangeText={setMnemonic}
          />

          <TouchableOpacity
            onPress={async () => {
              const value = await Clipboard.getStringAsync();
              setMnemonic(value);
            }}
          >
            <ClipboardDocumentListIcon color="#000000" />
          </TouchableOpacity>
        </View>

        <Button title="Import from seed phrase" onPress={onSeedPhraseImport} />
      </View>
    </SafeAreaView>
  );
}

export default MnemonicImport;