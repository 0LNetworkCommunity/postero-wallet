import { Button } from "@postero/ui";
import { View, Text, TouchableOpacity } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import tw from "twrnc";

import { NewWalletStackParams } from "../../params";
import NavBar from "../../../../../ui/NavBar";
import ChevronLeftIcon from "../../../../icons/ChevronLeftIcon";

function SafetyWarning({
  navigation,
}: StackScreenProps<NewWalletStackParams, "SafetyWarning">) {
  return (
    <View style={{ flex: 1 }}>
      <NavBar
        leftActions={
          <TouchableOpacity
            style={tw.style("p-2")}
            onPress={() => navigation.goBack()}
          >
            <ChevronLeftIcon color="#000000" />
          </TouchableOpacity>
        }
      />

      <Text>Create new wallet</Text>

      <Text>
        You have full control and custody over your assets. A 12-word secret
        recovery phase will be generated to secure your account.
      </Text>
      <Button
        title="Continue"
        onPress={() => {
          navigation.navigate("SeedPhrase");
        }}
      />
    </View>
  );
}

export default SafetyWarning;
