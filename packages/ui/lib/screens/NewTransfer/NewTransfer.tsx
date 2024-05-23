import {  View } from "react-native";
import { useState } from "react";

import Text from "../../components/Text";
import { AmountInput } from "../../components/AmountInput";

export function NewTransfer() {
  const [amount, setAmount] = useState('');

  return (
    <View>
      <Text>New Transfer</Text>

      <AmountInput
        value={amount}
        onChange={setAmount}
      />
    </View>
  );
}
