import { memo } from "react";
import { View, SafeAreaView, ScrollView } from "react-native";
import styled from "@emotion/native";

import { Text } from "../../components/Text";
import { SlowWalletRatio } from "../../components";
import { TouchableOpacity } from "react-native-gesture-handler";
import { PlusIcon } from "../../icons/PlusIcon";
import { Droplets03Icon } from "../../icons/Droplets03Icon";
import { MoneyAmount } from "../../components/MoneyAmount";
import { DotsVerticalIcon } from "../../icons/DotsVerticalIcon";

const Card = styled.View({
  backgroundColor: "#FFFFFF",
  borderRadius: 8,
  padding: 16,
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 1,
  },
  shadowOpacity: 0.18,
  shadowRadius: 1.0,

  elevation: 1,
});

enum BalanceType {
  Locked,
  Unlocked,
}

interface BalanceContainerProps {
  type: BalanceType;
  amount: number;
}

function BalanceContainer({ type, amount }: BalanceContainerProps) {
  return (
    <View style={{ flexGrow: 1 }}>
      <View
        style={{
          paddingBottom: 4,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: 12,
            height: 12,
            borderRadius: 2,
            marginRight: 8,
            backgroundColor:
              type === BalanceType.Locked
                ? "#D6D6D6"
                : type === BalanceType.Unlocked
                  ? "#CD3B42"
                  : undefined,
          }}
        />
        <Text text sm regular>
          {type === BalanceType.Unlocked && "Available"}
          {type === BalanceType.Locked && "Locked"}
        </Text>
      </View>
      <View>
        <Text text lg medium>
          <MoneyAmount
            amount={amount}
            renderSymbol={(symbol) => (
              <Text style={{ opacity: 0.585 }}>{symbol}</Text>
            )}
          />
        </Text>
      </View>
    </View>
  );
}

interface TotalBalanceProps {
  balance: number;
}

const TotalBalance = memo(({ balance }: TotalBalanceProps) => {
  return (
    <View>
      <MoneyAmount
        amount={balance}
        symbolLeading
        renderSymbol={(symbol) => (
          <Text text xl regular style={{ lineHeight: 44 }}>
            {symbol}
          </Text>
        )}
        renderInteger={(integer) => (
          <Text display md regular>
            {integer}
          </Text>
        )}
        renderDecimals={(decimals) => (
          <Text text xl regular style={{ opacity: 0.585 }}>
            {decimals}
          </Text>
        )}
      />
    </View>
  );
});

interface WalletListItemProps {
  label: string;
  address: string;
  unlockedAmount: number;
  lockedAmount?: number;
}

function WalletListItem({
  label,
  unlockedAmount,
  lockedAmount,
  address,
}: WalletListItemProps) {
  return (
    <Card>
      {lockedAmount !== undefined && (
        <View style={{ flexDirection: "row", paddingBottom: 8 }}>
          <View
            style={{
              backgroundColor: "#EEF4FF",
              borderRadius: 20,
              flexDirection: "row",
              paddingVertical: 6,
              paddingHorizontal: 10,
              alignItems: "center",
            }}
          >
            <Droplets03Icon size={12} color="#6172F3" />
            <Text text sm medium style={{ marginLeft: 4, color: "#3538CD" }}>
              Slow wallet
            </Text>
          </View>
        </View>
      )}

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View>
          <Text text lg regular>
            {label}
          </Text>
        </View>
        <View>
          <Text text lg medium>
            <MoneyAmount amount={unlockedAmount} />
          </Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View>
          <Text text sm regular tertiary>
            {`${address.substring(0, 4)}…${address.substring(address.length - 4)}`}
          </Text>
        </View>
        <View>
          {lockedAmount !== undefined && (
            <Text text sm regular tertiary>
              {"Locked: "}
              <MoneyAmount amount={lockedAmount} />
            </Text>
          )}
        </View>
      </View>
    </Card>
  );
}

interface Wallet {
  label: string;
  address: string;
  unlockedAmount: number;
  lockedAmount?: number;
}

interface Props {
  totalUnlockedBalance: number;
  totalLockedBalance?: number;
  wallets: Wallet[];
  onPressNewWallet: () => void;
  onPressWallet: (address: string) => void;
  onPressMore: () => void;
}

export function Home({
  totalUnlockedBalance,
  totalLockedBalance,
  wallets,
  onPressNewWallet,
  onPressMore,
  onPressWallet,
}: Props) {
  return (
    <View
      style={{
        backgroundColor: "#F5F5F5",
        flex: 1,
      }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ paddingHorizontal: 20 }}>
          <View style={{ paddingVertical: 24 }}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View>
                <Text text md regular>
                  Total Balance
                </Text>
                <TotalBalance
                  balance={
                    totalLockedBalance !== undefined
                      ? totalLockedBalance + totalUnlockedBalance
                      : totalUnlockedBalance
                  }
                />
              </View>

              <View>
                <TouchableOpacity onPress={onPressMore}>
                  <DotsVerticalIcon />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {totalLockedBalance !== undefined && (
            <View style={{ paddingBottom: 26 }}>
              <Card>
                <View style={{ flexDirection: "row" }}>
                  <BalanceContainer
                    type={BalanceType.Unlocked}
                    amount={totalUnlockedBalance}
                  />
                  <BalanceContainer
                    type={BalanceType.Locked}
                    amount={totalLockedBalance}
                  />
                </View>

                <View style={{ paddingTop: 16 }}>
                  <SlowWalletRatio
                    unlocked={totalUnlockedBalance}
                    locked={totalLockedBalance}
                  />
                </View>
              </Card>
            </View>
          )}

          <View style={{ paddingBottom: 10 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text text lg medium>
                My Wallets
              </Text>
              <TouchableOpacity onPress={onPressNewWallet}>
                <PlusIcon size={32} color="#141414" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={{ flex: 1 }}>
          <ScrollView style={{ flex: 1 }}>
            {wallets.map((wallet) => (
              <TouchableOpacity
                key={wallet.address}
                onPress={() => onPressWallet(wallet.address)}
              >
                <View style={{ paddingHorizontal: 20, paddingVertical: 6 }}>
                  <WalletListItem
                    label={wallet.label}
                    address={wallet.address}
                    lockedAmount={wallet.lockedAmount}
                    unlockedAmount={wallet.unlockedAmount}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
}
