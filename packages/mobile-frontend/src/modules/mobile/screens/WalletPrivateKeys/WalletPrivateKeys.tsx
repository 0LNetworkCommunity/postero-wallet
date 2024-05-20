import { useRef } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import tw from "twrnc";
import { gql, useQuery } from "@apollo/client";

import { ModalStackParams } from "../params";
import NavBar from "../../../ui/NavBar";
import ChevronLeftIcon from "../../icons/ChevronLeftIcon";
import PlusIcon from "../../icons/PlusIcon";
import ContextMenu, { ContextMenuHandle } from "./ContextMenu";
import ListItem from "./ListItem";

const GET_WALLET = gql`
  query GetWallet($address: Bytes!) {
    wallet(address: $address) {
      label
      address
      slowWallet {
        unlocked
      }
      keys {
        publicKey
        authKey
      }
    }
  }
`;

function WalletPrivateKeys({
  route,
  navigation,
}: StackScreenProps<ModalStackParams, "WalletPrivateKeys">) {
  const { walletAddress } = route.params;

  const contextMenu = useRef<ContextMenuHandle>(null);

  const { data, error, loading } = useQuery<{
    wallet: {
      address: string;
      label: string;
      keys: {
        authKey: string;
        publicKey: string;
      }[];
    };
  }>(GET_WALLET, {
    variables: {
      address: walletAddress,
    },
  });

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

      <View style={{ flex: 1 }}>
    <FlatList
      data={data?.wallet.keys ?? []}
      keyExtractor={(key) => key.publicKey}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      renderItem={({ item }) => {
        // const tap = Gesture.Tap()
        //   .maxDuration(500)
        //   .onEnd(() => {
        //     runOnJS(onWalletPress)(item);
        //   });

        // const longPress = Gesture.LongPress()
        //   .minDuration(800)
        //   .onStart(() => {
        //     runOnJS(onWalletContext)(item);
        //   });

        return (
          // <SwipeableRow onDelete={() => onWalletDelete(item)}>
            // <GestureDetector gesture={Gesture.Exclusive(tap, longPress)}>
              <ListItem publicKey={item.publicKey} authKey={item.authKey} />
            // </GestureDetector>
          // </SwipeableRow>
        );
      }}
    />
      </View>

      <ContextMenu ref={contextMenu} walletAddress={walletAddress} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  separator: {
    backgroundColor: 'rgb(200, 199, 204)',
    height: StyleSheet.hairlineWidth,
  },
});

export default WalletPrivateKeys;
