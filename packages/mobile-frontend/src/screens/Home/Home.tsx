import { FC, useRef } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { Home as HomeScreen } from "@postero/ui";

import { useWallets } from "../Wallets/hook";
import { ModalStackParams } from "../params";
import ContextMenu, { ContextMenuHandle } from "./ContextMenu";
import { NewWalletBottomSheet, NewWalletBottomSheetHandle } from "./NewWalletBottomSheet";

const Home: FC<StackScreenProps<ModalStackParams, "Main">> = ({
  navigation,
}) => {
  const contextMenu = useRef<ContextMenuHandle>(null);
  const newWalletBottomSheet = useRef<NewWalletBottomSheetHandle>(null);

  const wallets = useWallets();

  let totalLocked: number | undefined = undefined;
  let totalUnlocked = 0;

  if (wallets) {
    for (const wallet of wallets) {
      const libraBalance = wallet.balances.find(
        (it) => it.coin.symbol === "LIBRA"
      );
      if (libraBalance === undefined) {
        continue;
      }

      const libraAmount = parseInt(libraBalance.amount, 10);
      const slowWallet = wallet.slowWallet;

      if (slowWallet) {
        const unlocked = parseInt(slowWallet.unlocked, 10);
        const locked = libraAmount - unlocked;
        totalUnlocked += unlocked;
        totalLocked = (totalLocked ?? 0) + locked;
      } else {
        totalUnlocked += libraAmount;
      }
    }
  }

  if (totalLocked) {
    totalLocked /= 1e6;
  }
  if (totalUnlocked) {
    totalUnlocked /= 1e6;
  }

  return (
    <>
      <HomeScreen
        totalUnlockedBalance={totalUnlocked}
        totalLockedBalance={totalLocked}
        wallets={
          wallets?.map((wallet) => {
            let lockedAmount = wallet.slowWallet ? 0 : undefined;
            let unlockedAmount = 0;

            const libraBalance = wallet.balances.find(
              (balance) => balance.coin.symbol === "LIBRA"
            );

            if (libraBalance) {
              let amount = parseInt(libraBalance.amount, 10);

              if (wallet.slowWallet) {
                unlockedAmount = parseInt(wallet.slowWallet.unlocked, 10);
                lockedAmount = (amount - unlockedAmount) / 1e6;
              } else {
                unlockedAmount = amount;
              }
              unlockedAmount /= 1e6;
            }

            return {
              label: wallet.label,
              address: wallet.address,
              unlockedAmount: unlockedAmount,
              lockedAmount,
            };
          }) ?? []
        }
        onPressWallet={(walletAddress) => {
          navigation.navigate("Wallet", {
            walletAddress,
          });
        }}
        onPressNewWallet={() => {
          newWalletBottomSheet.current?.open();
        }}
        onPressMore={() => {
          contextMenu.current?.open();
        }}
      />

      <ContextMenu ref={contextMenu} />
      <NewWalletBottomSheet ref={newWalletBottomSheet} />
    </>
  );
};

export default Home;
