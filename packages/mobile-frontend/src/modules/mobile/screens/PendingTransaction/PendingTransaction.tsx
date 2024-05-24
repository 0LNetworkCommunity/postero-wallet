import { StackScreenProps } from "@react-navigation/stack";
import { Text, TouchableOpacity, View } from "react-native";
import tw from "twrnc";

import { ModalStackParams } from "../params";
import NavBar from "../../../ui/NavBar";
import ChevronLeftIcon from "../../icons/ChevronLeftIcon";
import { Button } from "@postero/ui";
import { gql, useApolloClient } from "@apollo/client";

const SEND_PENDING_TRANSACTION = gql`
   mutation SendPendingTransaction(
    $id: String!
  ) {
    sendPendingTransaction(id: $id)
  }
`;

function PendingTransaction({
  route,
  navigation,
}: StackScreenProps<ModalStackParams, "PendingTransaction">) {
  const apolloClient = useApolloClient();

  const onSend = async () => {
    try {
      const res = await apolloClient.mutate<{
        newTransfer: string;
      }>({
        mutation: SEND_PENDING_TRANSACTION,
        variables: {
          id: route.params.id,
        },
      });
      console.log('res', res);
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

      <Text>{route.params.id}</Text>

      <Button title="Send transaction" onPress={onSend} />
    </View>
  );

}

export default PendingTransaction;

