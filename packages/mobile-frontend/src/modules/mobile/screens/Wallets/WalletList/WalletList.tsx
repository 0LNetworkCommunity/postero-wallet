import { FC } from 'react';
import { StyleSheet, Text, View, I18nManager } from 'react-native';
import { FlatList, Gesture, GestureDetector, RectButton } from 'react-native-gesture-handler';
import tw from "twrnc";

import SwipeableRow from './SwipeableRow';
import { Wallet } from '../hook';
import { runOnJS } from 'react-native-reanimated';

//  To toggle LTR/RTL change to `true`
I18nManager.allowRTL(false);

const Row: FC<{ wallet: Wallet }> = ({ wallet }) => {
  const slowWallet = wallet.slowWallet;
  const libraBalance = wallet.balances.find((balance) => balance.coin.symbol === 'LIBRA');
  let libraAmount = libraBalance ? parseInt(libraBalance.amount, 10) : undefined;

  if (libraAmount !== undefined) {
    if (slowWallet) {
      libraAmount = Math.min(libraAmount, parseInt(slowWallet.unlocked, 10));
    }
    libraAmount /= 1e6;
  }

  return (
    <RectButton
      style={tw.style(
        "p-3 bg-white justify-between flex-col",
        styles.rectButton
      )}
    >
      <View style={tw.style("flex-row justify-between")}>
        <Text style={styles.fromText}>{wallet.label}</Text>

        <View style={tw.style("flex-row")}>
          {wallet.slowWallet && (
            <View
              style={tw.style(
                "items-center rounded-md bg-gray-100 px-1.5 py-0.5",
                "ml-1"
              )}
            >
              <Text style={tw.style("text-xs font-medium text-gray-600")}>
                Slow
              </Text>
            </View>
          )}

          {libraAmount !== undefined && (
            <View
              style={tw.style(
                "items-center rounded-md bg-gray-100 px-1.5 py-0.5",
                "ml-1"
              )}
            >
              <Text style={tw.style("text-xs font-medium text-gray-600")}>
                {`Ƚ ${libraAmount.toLocaleString()}`}
              </Text>
            </View>
          )}
        </View>
      </View>
      <Text numberOfLines={2} style={styles.messageText}>
        {wallet.address}
      </Text>
    </RectButton>
  );
};

interface Props {
  wallets: Wallet[];
  onWalletPress: (wallet: Wallet) => void;
  onWalletDelete: (wallet: Wallet) => void;
  onWalletContext: (wallet: Wallet) => void;
}

const WalletList: FC<Props> = ({
  wallets,
  onWalletPress,
  onWalletDelete,
  onWalletContext,
}) => {
  return (
    <FlatList
      // the array need to be copied here otherwise the `onEnd` callback of the
      // tap gesture in render item crashes for the wallet comming from the graphql subscription.
      // "Attempted to extract from a HostObject that wasn't converted to a Shareable"
      data={wallets.map((wallet) => ({
        ...wallet,
      }))}
      keyExtractor={(item) => item.address}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      renderItem={({ item }) => {
        const tap = Gesture.Tap()
          .maxDuration(500)
          .onEnd(() => {
            runOnJS(onWalletPress)(item);
          });

        const longPress = Gesture.LongPress()
          .minDuration(800)
          .onStart(() => {
            runOnJS(onWalletContext)(item);
          });

        return (
          <SwipeableRow onDelete={() => onWalletDelete(item)}>
            <GestureDetector gesture={Gesture.Exclusive(tap, longPress)}>
              <Row wallet={item} />
            </GestureDetector>
          </SwipeableRow>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  rectButton: {
    height: 80,
  },
  separator: {
    backgroundColor: 'rgb(200, 199, 204)',
    height: StyleSheet.hairlineWidth,
  },
  fromText: {
    fontWeight: 'bold',
    backgroundColor: 'transparent',
  },
  messageText: {
    color: '#999',
    backgroundColor: 'transparent',
  },
  dateText: {
    backgroundColor: 'transparent',
    position: 'absolute',
    right: 20,
    top: 10,
    color: '#999',
    fontWeight: 'bold',
  },
});

export default WalletList;
