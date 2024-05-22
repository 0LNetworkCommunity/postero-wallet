import type { Meta, StoryObj } from '@storybook/react';
import { MnemonicScreen } from "./MnemonicScreen";

function MnemonicScreenStory() {
  const mnemonic =
    "poverty fine embrace exotic wink solar kitten coast mom hello badge salt orchard dynamic become loyal bulb quarter tooth vacant charge split chat child";

  return (
    <MnemonicScreen mnemonic={mnemonic} />
  );
}

const meta: Meta<typeof MnemonicScreenStory> = {
  component: MnemonicScreenStory,
};

export default meta;

type Story = StoryObj<typeof MnemonicScreenStory>;

export const Basic: Story = {};
