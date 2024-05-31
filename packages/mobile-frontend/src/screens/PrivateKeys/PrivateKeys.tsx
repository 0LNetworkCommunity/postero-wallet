import { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, Text, View } from "react-native";
import { gql, useApolloClient } from "@apollo/client";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from '@react-navigation/native';

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
  const [keys, setKeys] = useState<{
    publicKey: string;
    wallets: {
      label: string;
      address: string;
    }[];
   }[]>([]);

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
      <View>
        <Text>Private keys</Text>
      </View>
      <ScrollView style={{ flex: 1 }}>
        {keys.map((key) => (
          <View key={key.publicKey} style={{}}>
            <View style={{ flex: 1, borderBottomWidth: 1 }} />

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
                    <Text>{`addr = ${wallet.address}`}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <View style={{ flex: 1, borderBottomWidth: 1 }} />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

export default PrivateKeys;
