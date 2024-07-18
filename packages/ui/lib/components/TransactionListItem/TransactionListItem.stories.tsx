import { View } from "react-native";
import type { Meta, StoryObj } from "@storybook/react";

import { TransactionListItem } from "./TransactionListItem";
import { ArrowUpRightIcon } from "../../icons";
import { Download01Icon } from "../../icons/Download01Icon";

function TransactionListItemStory() {
  return (
    <View>
      <TransactionListItem
        label="Sent LIBRA"
        statusLabel="Confirmed"
        icon={ArrowUpRightIcon}
        amountLabel="-250 Ƚ"
        success
        feeLabel="Fee: 0.0001 Ƚ"
      />
      <TransactionListItem
        label="Received LIBRA"
        statusLabel="Expired"
        icon={Download01Icon}
        amountLabel="-250 Ƚ"
        feeLabel="Fee: 0.0001 Ƚ"
      />
      <TransactionListItem
        label="Sent LIBRA"
        statusLabel="Failed"
        icon={ArrowUpRightIcon}
        amountLabel="-250 Ƚ"
        feeLabel="Fee: 0.0001 Ƚ"
      />
      <TransactionListItem
        label="Sent LIBRA"
        statusLabel="Confirmed"
        icon={ArrowUpRightIcon}
        amountLabel="-250 Ƚ"
        feeLabel="Fee: 0.0001 Ƚ"
      />
    </View>
  );
}

const meta: Meta<typeof TransactionListItemStory> = {
  component: TransactionListItemStory,
};

export default meta;

type Story = StoryObj<typeof TransactionListItemStory>;

export const Basic: Story = {};
