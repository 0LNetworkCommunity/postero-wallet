import { FC } from 'react';
import { StyleSheet, Text, View, I18nManager } from 'react-native';
import { FlatList, RectButton } from 'react-native-gesture-handler';

import SwipeableRow from './SwipeableRow';
import { Wallet } from '../hook';

//  To toggle LTR/RTL change to `true`
I18nManager.allowRTL(false);

const Row: FC<{ wallet: Wallet; onPress: () => void }> = ({ wallet, onPress }) => {
  return (
    <RectButton style={styles.rectButton} onPress={onPress}>
      <Text style={styles.fromText}>{wallet.label}</Text>
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
    flex: 1,
    height: 80,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    flexDirection: 'column',
    backgroundColor: 'white',
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
