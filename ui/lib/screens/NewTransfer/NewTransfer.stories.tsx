import type { Meta, StoryObj } from "@storybook/react";
import { NewTransfer } from "./NewTransfer";
import { useState } from "react";

function NewTransferStory() {
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  return (
    <NewTransfer
      available="2,685,928.113 Ƚ"
      onBack={() => {}}
      onScan={() => {}}
      amount={amount}
      onChangeAmount={setAmount}
      recipient={recipient}
      onChangeRecipient={setRecipient}
    />
  );
}

const meta: Meta<typeof NewTransferStory> = {
  component: NewTransferStory,
};

export default meta;

type Story = StoryObj<typeof NewTransferStory>;

export const Basic: Story = {};
