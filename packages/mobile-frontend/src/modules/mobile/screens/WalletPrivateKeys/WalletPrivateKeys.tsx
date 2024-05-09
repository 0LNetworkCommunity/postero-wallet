import { useRef } from "react";
import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import tw from "twrnc";

import { ModalStackParams } from "../params";
import NavBar from "../../../ui/NavBar";
import ChevronLeftIcon from "../../icons/ChevronLeftIcon";
import PlusIcon from "../../icons/PlusIcon";
import ContextMenu, { ContextMenuHandle } from "./ContextMenu";

function WalletPrivateKeys({
  route,
  navigation,
}: StackScreenProps<ModalStackParams, "WalletPrivateKeys">) {
  const { walletId } = route.params;
  const contextMenu = useRef<ContextMenuHandle>(null);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavBar
        title="Private keys"
        leftActions={
          <TouchableOpacity
            style={tw.style("p-2")}
            onPress={() => navigation.goBack()}
          >
            <ChevronLeftIcon color="#000000" />
          </TouchableOpacity>
        }
        rightActions={
          <TouchableOpacity
            style={tw.style("p-2")}
            onPress={() => {
              console.log('bonjour');
              contextMenu.current?.open();
            }}
          >
            <PlusIcon color="#000000" />
          </TouchableOpacity>
        }
      />

      <View>
        <Text>{`wallet id = ${walletId}`}</Text>
      </View>

      <ContextMenu ref={contextMenu} walletId={walletId} />
    </SafeAreaView>
  );
}

export default WalletPrivateKeys;
