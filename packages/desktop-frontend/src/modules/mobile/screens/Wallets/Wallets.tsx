import { FC, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { FlatList, Pressable, View, Text } from "react-native";
import tw from "twrnc";
import { gql, useApolloClient, useSubscription } from "@apollo/client";

const GET_WALLETS = gql`
  query GetWallets {
    wallets {
      id
      label
      publicKey
      authenticationKey
      accountAddress
    }
  }
`;

const Wallets: FC = () => {
  const navigation = useNavigation<any>();
  const apolloClient = useApolloClient();

  useEffect(() => {
    const getWallets = async () => {
      const res = await apolloClient.query({
        query: GET_WALLETS,
      });
      console.log(res);
    };

    getWallets();
  }, []);

  const wallets = [
    {
      id: "1",
      label: "First wallet",
    },
    {
      id: "2",
      label: "Second wallet",
    },
    {
      id: "3",
      label: "Third wallet",
    },
  ];

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={wallets}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => {
              navigation.navigate("Wallet");
            }}
          >
            <View style={tw.style("bg-white py-2 px-3 border-b border-slate-200")}>
              <Text>{item.label}</Text>
            </View>
          </Pressable>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default Wallets;
