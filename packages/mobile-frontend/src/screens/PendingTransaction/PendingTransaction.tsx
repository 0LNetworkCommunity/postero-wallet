import { StackScreenProps } from "@react-navigation/stack";
import { TouchableOpacity, View } from "react-native";
import tw from "twrnc";

import { ModalStackParams } from "../params";
import { PendingTransactionState } from "./PendingTransactionState";
import NavBar from "../../ui/NavBar";
import ChevronLeftIcon from "../../icons/ChevronLeftIcon";

function PendingTransactionView({
  route,
  navigation,
}: StackScreenProps<ModalStackParams, "PendingTransaction">) {
  return (
    <View
      style={{
        backgroundColor: "#ffffff",
        flex: 1,
      }}
    >
      <NavBar
        title="Pending Transaction"
        leftActions={
          <TouchableOpacity
            style={tw.style("p-2")}
            onPress={() => navigation.goBack()}
          >
            <ChevronLeftIcon color="#000000" />
          </TouchableOpacity>
        }
      />

      <PendingTransactionState id={route.params.id} />
    </View>
  );
}

export default PendingTransactionView;
