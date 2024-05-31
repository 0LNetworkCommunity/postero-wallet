import { useState } from "react";
import { View, TextInput, ActivityIndicator, SafeAreaView, TouchableOpacity } from "react-native";
import tw from "twrnc";
import { gql, useApolloClient } from "@apollo/client";
import * as Clipboard from 'expo-clipboard';
import { CompositeScreenProps } from "@react-navigation/native";

import { Button } from "@postero/ui";
import { StackScreenProps } from "@react-navigation/stack";
import { NewWalletStackParams } from "../../params";
import { ModalStackParams } from "../../../params";
import ClipboardDocumentListIcon from "../../../../icons/ClipboardDocumentListIcon";

const IMPORT_PRIVATE_KEY = gql`
  mutation ImportPrivateKey($privateKey: String!) {
    importPrivateKey(privateKey: $privateKey)
  }
`;

function PrivateKeyImport({
  navigation,
}: CompositeScreenProps<
  StackScreenProps<NewWalletStackParams, "PrivateKeyImport">,
  StackScreenProps<ModalStackParams>
>) {
  const [privateKey, setPrivateKey] = useState("");
  const [loading, setLoading] = useState(false);
  const apolloClient = useApolloClient();

  const onPrivateKeyImport = async () => {
    if (!privateKey) {
      return;
    }

    setLoading(true);
    try {
      setPrivateKey("");
      await apolloClient.mutate({
        mutation: IMPORT_PRIVATE_KEY,
        variables: {
          privateKey,
        },
      });
      navigation.navigate("Main");
    } finally {
      setLoading(false);
    }
    navigation.pop();
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
            value={privateKey}
            secureTextEntry
            onChangeText={setPrivateKey}
          />

          <TouchableOpacity
            onPress={async () => {
              const value = await Clipboard.getStringAsync();
              setPrivateKey(value);
            }}
          >
            <ClipboardDocumentListIcon color="#000000" />
          </TouchableOpacity>
        </View>

        <Button title="Import from private key" onPress={onPrivateKeyImport} />
      </View>
    </SafeAreaView>
  );
}

export default PrivateKeyImport;
