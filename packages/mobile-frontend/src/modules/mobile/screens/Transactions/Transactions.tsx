import { SafeAreaView, TouchableOpacity, View, Text } from "react-native";
import tw from "twrnc";
import { StackScreenProps } from "@react-navigation/stack";

import NavBar from "../../../ui/NavBar";
import { ModalStackParams } from "../params";
import ChevronLeftIcon from "../../icons/ChevronLeftIcon";

function Transactions({
  route,
  navigation,
}: StackScreenProps<ModalStackParams, "Transactions">) {
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

export default Transactions;
