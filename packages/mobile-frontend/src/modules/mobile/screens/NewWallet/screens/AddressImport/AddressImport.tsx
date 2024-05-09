import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import tw from "twrnc";
import { gql, useApolloClient } from "@apollo/client";
import { StackScreenProps } from "@react-navigation/stack";
import * as Clipboard from 'expo-clipboard';

import { Button } from "@postero/ui";
import { NewWalletStackParams } from "../../params";
import { CompositeScreenProps } from "@react-navigation/native";
import { ModalStackParams } from "../../../params";
import ClipboardDocumentListIcon from "../../../../icons/ClipboardDocumentListIcon";

const IMPORT_ADDRESS = gql`
  mutation ImportAddress($address: String!) {
    importAddress(address: $address)
  }
`;

function AddressImport({
  navigation,
  route,
}: CompositeScreenProps<
  StackScreenProps<NewWalletStackParams, "AddressImport">,
  StackScreenProps<ModalStackParams>
>) {
  const [address, setAddress] = useState("");
  const apolloClient = useApolloClient();

  const onAddressImport = async () => {
    await apolloClient.mutate({
      mutation: IMPORT_ADDRESS,
      variables: {
        address,
      },
    });
    setAddress("");
    navigation.navigate(route.params.redirectTo);
  };

  return (
    <View>
      <Text>
        By importing an address, you'll only be able to see the wallet's
        activity. You will not be able to send transaction from this wallet
        until you import the corresponding seed phrase or private key.
      </Text>

      <TextInput
        style={tw.style("border")}
        value={address}
        onChangeText={setAddress}
        autoComplete="off"
        autoCorrect={false}
        autoFocus
      />

      <TouchableOpacity
        onPress={async () => {
          const value = await Clipboard.getStringAsync();
          setAddress(value);
        }}
      >
        <ClipboardDocumentListIcon color="#000000" />
      </TouchableOpacity>

      <Button title="Import address" onPress={onAddressImport} />
    </View>
  );
}

export default AddressImport;
