import { FC, useEffect, useState } from "react";
import { View, Animated } from "react-native";
import { gql, useApolloClient } from "@apollo/client";
import { StackScreenProps } from "@react-navigation/stack";
import { getLocales } from "expo-localization";

import { NewTransfer } from "@postero/ui";

import { ModalStackParams } from "../params";
import { useKeyboardHeight } from "../../utils/keyboard";

const decimalSeparator = getLocales()[0].decimalSeparator || ".";

const NEW_TRANSFER = gql`
  mutation NewTransfer(
    $walletAddress: Bytes!
    $recipient: Bytes!
    $amount: BigInt!
  ) {
    newTransfer(
      walletAddress: $walletAddress
      recipient: $recipient
      amount: $amount
    )
  }
`;

const ZERO_ASCII = "0".charCodeAt(0);
const NINE_ASCII = "9".charCodeAt(0);

function filterDigits(input: string): string {
  let out = "";
  for (let i = 0; i < input.length; ++i) {
    const code = input.charCodeAt(i);
    if (code >= ZERO_ASCII && code <= NINE_ASCII) {
      out = out.concat(input[i]);
    }
  }
  return out;
}

const NewTransferScreen: FC<
  StackScreenProps<ModalStackParams, "NewTransfer">
> = ({ route, navigation }) => {
  const apolloClient = useApolloClient();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");

  const keyboardHeight = useKeyboardHeight();

  useEffect(() => {
    if (route.params.barCodeResult) {
      setRecipient(route.params.barCodeResult);
    }
  }, [route.params.barCodeResult]);

  const onConfirm = async ({
    amount,
    recipient,
  }: {
    amount: string;
    recipient: string;
  }) => {
    const decimalSeparatorIndex = amount.indexOf(decimalSeparator);
    const integer = filterDigits(
      decimalSeparatorIndex === -1
        ? amount
        : amount.substring(0, decimalSeparatorIndex)
    );
    const decimals =
      decimalSeparatorIndex === -1
        ? "000000"
        : filterDigits(amount.substring(decimalSeparatorIndex + 1)).padEnd(
            6,
            "0"
          );

    try {
      const res = await apolloClient.mutate<{
        newTransfer: string;
      }>({
        mutation: NEW_TRANSFER,
        variables: {
          recipient,
          walletAddress: route.params.walletAddress,
          amount: `${integer}${decimals}`,
        },
      });

      if (res.data) {
        navigation.replace("PendingTransaction", {
          id: res.data.newTransfer,
        });
      }
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
        onConfirm={onConfirm}
        onScan={() => {
          navigation.navigate("BarCodeScanner", {
            redirect: "NewTransfer",
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
