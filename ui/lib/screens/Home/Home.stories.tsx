import { View, StyleSheet } from "react-native";
import type { Meta, StoryObj } from "@storybook/react";

import { Home } from "./Home";

function HomeStory() {
  return (
    <View style={StyleSheet.absoluteFillObject}>
      <Home
        totalUnlockedBalance={7_000_000}
        totalLockedBalance={500_000}
        wallets={[
          {
            label: "Wallet #1",
            address: "03A3FCFAF8224BD598D96BBAF0C6D99F",
            unlockedAmount: 5_363_402.755689,
            lockedAmount: 827_943.929318,
          },
          {
            label: "Wallet #2",
            address:
              "FE01B4146468CD24426912CBDDF545B918DC9BAD4B990DC013AA71491C71FEB8",
            unlockedAmount: 564.5132,
            lockedAmount: 0,
          },
        ]}
        onPressWallet={() => {}}
        onPressNewWallet={() => {}}
        onPressMore={() => {}}
      />
    </View>
  );
}

const meta: Meta<typeof HomeStory> = {
  component: HomeStory,
  parameters: { noSafeArea: true },
};

export default meta;

type Story = StoryObj<typeof HomeStory>;

export const Basic: Story = {};
