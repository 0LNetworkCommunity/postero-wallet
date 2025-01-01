import { Text, SafeAreaView, TouchableOpacity, View } from "react-native";
import tw from "twrnc";
import { gql, useApolloClient, useQuery } from "@apollo/client";
import { StackScreenProps } from "@react-navigation/stack";

import { Button } from "@postero/ui";
import { ModalStackParams } from "../params";
import NavBar from "../../ui/NavBar";
import ChevronLeftIcon from "../../icons/ChevronLeftIcon";
import { useState } from "react";

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

const EXPORT_PRIVATE_KEY = gql`
  query ExportPrivateKey($publicKey: Bytes!) {
    exportPrivateKey(publicKey: $publicKey)
  }
`;

function PrivateKey({
  route,
  navigation,
}: StackScreenProps<ModalStackParams, "PrivateKey">) {
  const apolloClient = useApolloClient();
  const [privateKey, setPrivateKey] = useState<string>();

  const { data, error, loading } = useQuery<{
    privateKey: {
      publicKey: string;
      authKey: string;
      wallets: {
        address: string;
        label: string;
      }[];
    };
  }>(GET_PRIVATE_KEY, {
    variables: {
      publicKey: route.params.publicKey,
    },
  });

  const exportPrivateKey = async () => {
    const res = await apolloClient.query<{
      exportPrivateKey: string | null;
    }>({
      query: EXPORT_PRIVATE_KEY,
      variables: {
        publicKey: route.params.publicKey,
      },
    });
    if (res.data.exportPrivateKey) {
      setPrivateKey(res.data.exportPrivateKey);
    }
  };

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
        <View style={{ flexDirection: "row" }}>
          <Text>{"public key = "}</Text>
          <Text selectable>{data?.privateKey.publicKey}</Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text>{"auth key = "}</Text>
          <Text selectable>{data?.privateKey.authKey}</Text>
        </View>
        {privateKey && (
          <View style={{ flexDirection: "row" }}>
            <Text>{"private key = "}</Text>
            <Text selectable>{privateKey}</Text>
          </View>
        )}
      </View>

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
        <Button
          title="Reveal private key"
          onPress={() => {
            exportPrivateKey();
          }}
        />
        {/* <Button title="Delete" onPress={() => {}} /> */}
      </View>
    </SafeAreaView>
  );
}

export default PrivateKey;
