import { useNavigation } from "@react-navigation/native";
import { View, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

interface Props {
  publicKey: string;
  authKey: string;
}

function ListItem({ publicKey, authKey }: Props) {
  const navigation = useNavigation<any>();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("PrivateKey", { publicKey });
      }}
    >
      <View>
        <Text>{`public key = ${publicKey}`}</Text>
        <Text>{`auth key = ${authKey}`}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default ListItem;
