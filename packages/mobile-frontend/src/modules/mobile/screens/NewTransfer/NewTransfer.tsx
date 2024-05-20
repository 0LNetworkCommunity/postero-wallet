import { FC, useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { gql, useApolloClient } from "@apollo/client";
import tw from "twrnc";
import { StackScreenProps } from "@react-navigation/stack";
import { ModalStackParams } from "../params";

const NEW_TRANSFER = gql`
  mutation NewTransfer(
    $walletAddress: Bytes!,
    $recipient: Bytes!,
    $amount: Int!
  ) {
    newTransfer(
      walletAddress: $walletAddress,
      recipient: $recipient,
      amount: $amount
    )
  }
`;

const NewTransfer: FC<StackScreenProps<ModalStackParams, "NewTransfer">> = ({ route, navigation }) => {
  const apolloClient = useApolloClient();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");

  const onConfirm = async () => {
    try {
      const res = await apolloClient.mutate({
        mutation: NEW_TRANSFER,
        variables: {
          recipient,
          walletAddress: route.params.walletAddress,
          amount: parseInt(amount, 10),
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const onCancel = async () => {
    navigation.pop();
  };

  return (
    <View style={tw.style("flex-1 p-2")}>
      <Text style={tw.style("font-medium text-lg")}>New Transfer</Text>

      <Text>Recipient</Text>
      <TextInput
        style={tw.style("border p-1")}
        value={recipient}
        onChangeText={setRecipient}
      />

      <Text>Amount</Text>
      <TextInput
        style={tw.style("border p-1")}
        value={amount}
        onChangeText={setAmount}
      />

      <Button onPress={onConfirm} title="Send" />
      <Button onPress={onCancel} title="Cancel" />
      <Button
        onPress={() => {
          navigation.navigate("BarCodeScanner", {
            onScan: (data) => {
              setRecipient(data);
            },
          });
        }}
        title="Scan"
      />
    </View>
  );
};

export default NewTransfer;
