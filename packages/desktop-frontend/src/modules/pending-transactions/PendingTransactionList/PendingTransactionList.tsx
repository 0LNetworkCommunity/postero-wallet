import { FC } from "react";
import { View, ScrollView, Pressable } from "react-native";
import tw from "twrnc";

import { PendingTransaction } from "../types";
import PendingTransactionListItem from "./ListItem";

interface Props {
  pendingTransactions: PendingTransaction[];
  onItemPress: (pendingTransaction: PendingTransaction) => void;
}

const PendingTransactionList: FC<Props> = ({
  pendingTransactions,
  onItemPress,
}) => {
  return (
    <View style={tw.style("flex-1")}>
      <ScrollView>
        {pendingTransactions.map((pendingTransaction) => (
          <Pressable
            key={pendingTransaction.id}
            onPress={() => onItemPress(pendingTransaction)}
          >
            <PendingTransactionListItem
              pendingTransaction={pendingTransaction}
            />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

export default PendingTransactionList;
