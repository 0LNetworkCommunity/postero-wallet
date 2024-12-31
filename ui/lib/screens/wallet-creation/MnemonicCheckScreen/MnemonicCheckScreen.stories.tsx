import type { Meta, StoryObj } from '@storybook/react';
import { MnemonicCheckScreen } from "./MnemonicCheckScreen";

const meta: Meta<typeof MnemonicCheckScreen> = {
  component: MnemonicCheckScreen,
};

export default meta;

type Story = StoryObj<typeof MnemonicCheckScreen>;

export const Basic: Story = {};
