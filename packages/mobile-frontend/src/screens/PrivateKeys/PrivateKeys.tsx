import { useEffect, useState } from "react";
import { FlatList, SafeAreaView, Text, View, StyleSheet } from "react-native";
import { gql, useApolloClient } from "@apollo/client";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";

const GET_PRIVATE_KEYS = gql`
  query GetPrivateKeys {
    privateKeys {
      publicKey

      wallets {
        label
        address
      }
    }
  }
`;

function PrivateKeys() {
  const navigation = useNavigation<any>();
  const apolloClient = useApolloClient();
  const [keys, setKeys] = useState<
    {
      publicKey: string;
      wallets: {
        label: string;
        address: string;
      }[];
    }[]
  >([]);

  useEffect(() => {
    const getWallets = async () => {
      const res = await apolloClient.query<{
        privateKeys: {
          publicKey: string;
          wallets: {
            label: string;
            address: string;
          }[];
        }[];
      }>({
        query: GET_PRIVATE_KEYS,
      });
      setKeys(res.data.privateKeys);
    };
    getWallets();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={keys}
        keyExtractor={(item) => item.publicKey}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item: key }) => {
          return (
            <View style={styles.listItemContainer}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("PrivateKey", {
                    publicKey: key.publicKey,
                  });
                }}
              >
                <Text>{`Public key = ${key.publicKey}`}</Text>
              </TouchableOpacity>

              <View>
                {key.wallets.map((wallet) => (
                  <TouchableOpacity
                    key={wallet.address}
                    onPress={() => {
                      navigation.navigate("Wallet", {
                        walletAddress: wallet.address,
                      });
                    }}
                  >
                    <View>
                      <Text>{`label = ${wallet.label}`}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  separator: {
    backgroundColor: "rgb(200, 199, 204)",
    height: StyleSheet.hairlineWidth,
  },
  listItemContainer: {
    padding: 10,
  },
});

export default PrivateKeys;
