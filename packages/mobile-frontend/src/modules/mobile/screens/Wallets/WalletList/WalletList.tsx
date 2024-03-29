import { FC } from 'react';
import { StyleSheet, Text, View, I18nManager } from 'react-native';
import { FlatList, RectButton } from 'react-native-gesture-handler';
import tw from "twrnc";

import SwipeableRow from './SwipeableRow';
import { Wallet } from '../hook';

//  To toggle LTR/RTL change to `true`
I18nManager.allowRTL(false);

const Row: FC<{ wallet: Wallet; onPress: () => void }> = ({ wallet, onPress }) => {
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
      onPress={onPress}
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
        {wallet.accountAddress}
      </Text>
    </RectButton>
  );
};

interface Props {
  wallets: Wallet[];
  onWalletPress: (wallet: Wallet) => void;
  onWalletDelete: (wallet: Wallet) => void;
}

const WalletList: FC<Props> = ({ wallets, onWalletPress, onWalletDelete }) => {
  return (
    <FlatList
      data={wallets}
      keyExtractor={(item) => item.id}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      renderItem={({ item }) => (
        <SwipeableRow onDelete={() => onWalletDelete(item)}>
          <Row wallet={item} onPress={() => onWalletPress(item)} />
        </SwipeableRow>
      )}
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
