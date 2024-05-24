import { FC, useState } from "react";
import { View, Animated } from "react-native";
import { gql, useApolloClient } from "@apollo/client";
import { StackScreenProps } from "@react-navigation/stack";
import { NewTransfer } from "@postero/ui";
import { ModalStackParams } from "../params";
import { useKeyboardHeight } from "../../../utils/keyboard";

const NEW_TRANSFER = gql`
  mutation NewTransfer(
    $walletAddress: Bytes!
    $recipient: Bytes!
    $amount: Int!
  ) {
    newTransfer(
      walletAddress: $walletAddress
      recipient: $recipient
      amount: $amount
    )
  }
`;

const NewTransferScreen: FC<
  StackScreenProps<ModalStackParams, "NewTransfer">
> = ({ route, navigation }) => {
  const apolloClient = useApolloClient();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");

  // const insets = useSafeAreaInsets();
  const keyboardHeight = useKeyboardHeight();

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

  return (
    <View
      style={{
        backgroundColor: "#ffffff",
        flex: 1,
      }}
    >
      <NewTransfer
        onBack={() => navigation.pop()}
        onConfirm={(details) => {
          console.log(details);
        }}
        onScan={() => {
          navigation.navigate("BarCodeScanner", {
            onScan: (data) => {
              setRecipient(data);
            },
          });
        }}
        amount={amount}
        onChangeAmount={setAmount}
        recipient={recipient}
        onChangeRecipient={setRecipient}
      />
      <Animated.View style={{ height: keyboardHeight }} />
    </View>
  );
};

export default NewTransferScreen;
