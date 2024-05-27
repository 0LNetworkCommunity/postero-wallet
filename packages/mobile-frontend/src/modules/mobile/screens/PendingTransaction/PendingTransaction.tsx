import { useEffect, useState } from "react";
import { gql, useApolloClient } from "@apollo/client";
import { StackScreenProps } from "@react-navigation/stack";
import { TouchableOpacity, View } from "react-native";
import tw from "twrnc";

import { ModalStackParams } from "../params";
import NavBar from "../../../ui/NavBar";
import ChevronLeftIcon from "../../icons/ChevronLeftIcon";
import { PendingTransactionState } from "./PendingTransactionState";
import { PendingTransaction } from "./types";

const GET_PENDING_TRANSACTION = gql`
  query GetPendingTransaction($id: ID!) {
    pendingTransaction(id: $id) {
      id
      hash
      status
    }
  }
`;

function PendingTransactionView({
  route,
  navigation,
}: StackScreenProps<ModalStackParams, "PendingTransaction">) {
  const apolloClient = useApolloClient();
  const [transaction, setTransaction] = useState<PendingTransaction | null>(
    null
  );

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apolloClient.mutate<{
          pendingTransaction: PendingTransaction;
        }>({
          mutation: GET_PENDING_TRANSACTION,
          variables: {
            id: route.params.id,
          },
        });
        setTransaction(res.data?.pendingTransaction ?? null);
      } catch (error) {
        console.error(error);
      }
    };

    load();
  }, [route.params.id]);

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

      {transaction && <PendingTransactionState id={transaction.id} />}
    </View>
  );
}

export default PendingTransactionView;
