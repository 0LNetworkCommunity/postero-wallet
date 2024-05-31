import { StackScreenProps } from "@react-navigation/stack";
import { View, Text, TouchableOpacity, SafeAreaView, FlatList, Platform } from "react-native";
import { gql, useQuery } from "@apollo/client";
import tw from "twrnc";

import { ModalStackParams } from "../params";
import NavBar from "../../ui/NavBar";
import ChevronLeftIcon from "../../icons/ChevronLeftIcon";

const GET_PENDING_TRANSACTIONS = gql`
  query GetPendingTransactions {
    pendingTransactions {
      id
      hash
      status
      createdAt
    }
  }
`;

export function PendingTransactions({
  route,
  navigation,
}: StackScreenProps<ModalStackParams, "PendingTransactions">) {
  const { data, error, loading } = useQuery<{
    pendingTransactions: {
      id: string;
      hash: string;
      status: string;
      createdAt: number;
    }[];
  }>(GET_PENDING_TRANSACTIONS);

  console.log({ data, error, loading });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavBar
        title="Pending transactions"
        leftActions={
          <TouchableOpacity
            style={tw.style("p-2")}
            onPress={() => navigation.goBack()}
          >
            <ChevronLeftIcon color="#000000" />
          </TouchableOpacity>
        }
      />

      <FlatList
        data={data?.pendingTransactions ?? []}
        keyExtractor={(it) => it.id}
        ItemSeparatorComponent={() => (
          <View
            style={[
              {
                height: 1,
                backgroundColor: "#000000",
                opacity: 0.1,
                marginVertical: 8,
              },
            ]}
          />
        )}
        renderItem={({ item }) => {
          return (
            <View style={{ padding: 8 }}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("PendingTransaction", {
                    id: item.id,
                  })
                }
              >
                <View>
                  <Text>{`status = ${item.status}`}</Text>
                  <Text>{`created at = ${new Date(item.createdAt)}`}</Text>
                </View>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}
