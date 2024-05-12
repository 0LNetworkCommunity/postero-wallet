import { Text, SafeAreaView, TouchableOpacity } from "react-native";
import tw from "twrnc";
import NavBar from "../../../ui/NavBar";
import { useNavigation } from "@react-navigation/native";
import ChevronLeftIcon from "../../icons/ChevronLeftIcon";
import { gql } from "@apollo/client";

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


function PrivateKey() {
  const navigation = useNavigation();

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
      <Text>Private key</Text>

    </SafeAreaView>
  );
}

export default PrivateKey;
