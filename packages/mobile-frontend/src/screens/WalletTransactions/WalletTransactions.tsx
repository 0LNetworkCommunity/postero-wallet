import { SafeAreaView, TouchableOpacity, View, Text } from "react-native";
import tw from "twrnc";
import { StackScreenProps } from "@react-navigation/stack";

import { ModalStackParams } from "../params";
import NavBar from "../../ui/NavBar";
import ChevronLeftIcon from "../../icons/ChevronLeftIcon";

export function WalletTransactions({
  route,
  navigation,
}: StackScreenProps<ModalStackParams, "WalletTransactions">) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavBar
        title="Transactions"
        leftActions={
          <TouchableOpacity
            style={tw.style("p-2")}
            onPress={() => navigation.goBack()}
          >
            <ChevronLeftIcon color="#000000" />
          </TouchableOpacity>
        }
      />

      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Transaction");
        }}
      >
        <View>
          <Text>Tx #1</Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
