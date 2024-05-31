import { Text, SafeAreaView, TouchableOpacity, View } from "react-native";
import tw from "twrnc";
import { gql, useQuery } from "@apollo/client";
import { StackScreenProps } from "@react-navigation/stack";

import { Button } from "@postero/ui";
import { ModalStackParams } from "../params";
import NavBar from "../../ui/NavBar";
import ChevronLeftIcon from "../../icons/ChevronLeftIcon";

const GET_PRIVATE_KEY = gql`
  query GetPrivateKey($publicKey: Bytes!) {
    privateKey(publicKey: $publicKey) {
      publicKey
      authKey
      wallets {
        label
        address
      }
    }
  }
`;


function PrivateKey({
  route,
  navigation,
}: StackScreenProps<ModalStackParams, "PrivateKey">) {
  const { data, error, loading } = useQuery<{
    privateKey: {
      wallets: {
        address: string;
        label: string;
      }[];
    }
  }>(GET_PRIVATE_KEY, {
    variables: {
      publicKey: route.params.publicKey,
    },
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavBar
        title="Private key"
        leftActions={
          <TouchableOpacity
            style={tw.style("p-2")}
            onPress={() => navigation.goBack()}
          >
            <ChevronLeftIcon color="#000000" />
          </TouchableOpacity>
        }
      />

      <View>
        {data?.privateKey.wallets.map((wallet) => (
          <TouchableOpacity
            key={wallet.address}
            onPress={() => {
              navigation.navigate("Wallet", { walletAddress: wallet.address });
            }}
          >
            <View>
              <View>
                <Text>{`Label = ${wallet.label}`}</Text>
                <Text>{`Wallet address = ${wallet.address}`}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View>
        <Button title="Export private key" onPress={() => {}} />
      </View>
    </SafeAreaView>
  );
}

export default PrivateKey;
