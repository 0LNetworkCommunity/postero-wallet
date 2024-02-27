import { FC, useState } from "react";
import { View, Button, ActivityIndicator, TextInput } from "react-native";
import { gql, useApolloClient } from "@apollo/client";
import tw from "twrnc";
import { StackScreenProps } from "@react-navigation/stack";
import { ModalStackParams } from "../params";

const NEW_WALLET = gql`
  mutation NewWallet {
    newWallet {
      id
      label
    }
  }
`;

const IMPORT_WALLET = gql`
  mutation ImportWallet($mnemonic: String!) {
    importWallet(mnemonic: $mnemonic)
  }
`;

const NewWallet: FC<StackScreenProps<ModalStackParams, "NewWallet">> = ({
  navigation,
}) => {
  const [loading, setLoading] = useState(false);
  const [mnemonic, setMnemonic] = useState('');
  const apolloClient = useApolloClient();

  const onNewWallet = async () => {
    try {
      setLoading(true);
      await apolloClient.mutate({
        mutation: NEW_WALLET,
      });
      navigation.pop();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onImportWallet = async () => {
    await apolloClient.mutate({
      mutation: IMPORT_WALLET,
      variables: {
        mnemonic,
      }
    });
    setMnemonic('');
    navigation.pop();
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <View style={tw.style("p-2")}>
          <Button title="New Wallet" onPress={onNewWallet} />

          <TextInput
            style={tw.style("border")}
            value={mnemonic}
            secureTextEntry
            onChangeText={setMnemonic}
          />
          <Button title="Import Wallet" onPress={onImportWallet} />
        </View>
      )}
    </View>
  );
};

export default NewWallet;
