import { SafeAreaView, TouchableOpacity } from "react-native";
import tw from "twrnc";
import { StackScreenProps } from "@react-navigation/stack";

import NavBar from "../../../ui/NavBar";
import { ModalStackParams } from "../params";
import ChevronLeftIcon from "../../icons/ChevronLeftIcon";

function Transaction({
  route,
  navigation,
}: StackScreenProps<ModalStackParams, "Transaction">) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavBar
        title="Transaction"
        leftActions={
          <TouchableOpacity
            style={tw.style("p-2")}
            onPress={() => navigation.goBack()}
          >
            <ChevronLeftIcon color="#000000" />
          </TouchableOpacity>
        }
      />
      </SafeAreaView>
  );
}

export default Transaction;
