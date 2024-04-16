import { FC } from "react";
import { View, Text, SafeAreaView } from "react-native";
import tw from "twrnc";
import { StackScreenProps } from "@react-navigation/stack";
import { Button } from "@postero/ui";

import { WalletScreen } from "@postero/ui";

import { useWallets } from "../Wallets/hook";
import { ModalStackParams } from "../params";
import Wallets from "../Wallets";

const aHome: FC = () => {
  return <WalletScreen />;
};

const Home: FC<StackScreenProps<ModalStackParams, "Main">> = ({
  route,
  navigation,
}) => {
  const wallets = useWallets();

  let totalLocked = 0;
  let totalUnlocked = 0;

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
      totalLocked += locked;
    } else {
      totalUnlocked += libraAmount;
    }
  }

  if (totalLocked) {
    totalLocked /= 1e6;
  }
  if (totalUnlocked) {
    totalUnlocked /= 1e6;
  }

  const rate = 0.01159;

  return (
    <SafeAreaView>
      <View style={tw.style("p-2")}>
        <View style={tw.style("flex-row mb-2")}>

          <View style={tw.style("basis-1/2 pr-2")}>
            <View style={tw.style("p-2 rounded-md bg-white")}>
              <Text style={tw.style("text-gray-500 text-base leading-6")}>
                Balance
              </Text>
              <Text style={tw.style("text-black text-xl leading-6 font-semibold")}>
                {`Ƚ ${totalUnlocked.toLocaleString()}`}
              </Text>
              <Text style={tw.style("text-gray-600 text-base leading-6")}>
                {`$ ${(rate * totalUnlocked).toLocaleString()}`}
              </Text>
            </View>
          </View>

          <View style={tw.style("basis-1/2", "p-2 rounded-md bg-white mb-2")}>
            <Text style={tw.style("text-gray-500 text-base leading-6")}>
              Locked
            </Text>
            <Text style={tw.style("text-black text-xl leading-6 font-semibold")}>
              {`Ƚ ${totalLocked.toLocaleString()}`}
            </Text>
            <Text style={tw.style("text-gray-600 text-base leading-6")}>
              {`$ ${(rate * totalLocked).toLocaleString()}`}
            </Text>
          </View>
        </View>

        <Button
          title="New Wallet"
          onPress={() => {
            navigation.navigate("NewWallet");
          }}
        />

        <Wallets />

      </View>
    </SafeAreaView>
  );
};

export default Home;
