import { FC } from "react";
import {
  View,
  VirtualizedList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import tw from "twrnc";
import { useNavigation } from "@react-navigation/native";

import MovementItem from "./MovementItem";
import { Movement } from "../../movements";
import { PendingTransaction } from "../../pending-transactions";
import { PendingTransactionItem } from "./PendingTransactionItem";

interface Props {
  movements: (Movement | PendingTransaction)[];
}

const Movements: FC<Props> = ({ movements }) => {
  const navigation = useNavigation<any>();

  return (
    <View style={tw.style("flex-1")}>
      <View style={tw.style("flex-1")}>
        <VirtualizedList<Movement | PendingTransaction>
          data={movements}
          initialNumToRender={2}
          renderItem={({ item }) => {
            if (item instanceof Movement) {
              return (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate({
                      name: "Transaction",
                      params: {
                        hash: Buffer.from(item.transaction.hash).toString(
                          "hex"
                        ),
                      },
                    });
                  }}
                >
                  <MovementItem movement={item} />
                </TouchableOpacity>
              );
            }

            if (item instanceof PendingTransaction) {
              return (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("Transaction", {
                      hash: Buffer.from(item.hash).toString("hex"),
                    });
                  }}
                >
                  <PendingTransactionItem hash={item.hash} />
                </TouchableOpacity>
              );
            }

            return <View />;
          }}
          keyExtractor={(item) => {
            if (item instanceof Movement) {
              return `movement-${item.version}`;
            }
            if (item instanceof PendingTransaction) {
              return `pending-transaction-${Buffer.from(item.hash).toString("hex")}`;
            }
            return "";
          }}
          getItemCount={(items: (Movement | PendingTransaction)[]) =>
            items.length
          }
          getItem={(items: (PendingTransaction | Movement)[], index) =>
            items[index]
          }
          ItemSeparatorComponent={() => (
            <View
              style={tw.style("w-full bg-gray-300", {
                height: StyleSheet.hairlineWidth,
              })}
            />
          )}
        />
      </View>
    </View>
  );
};

export default Movements;
