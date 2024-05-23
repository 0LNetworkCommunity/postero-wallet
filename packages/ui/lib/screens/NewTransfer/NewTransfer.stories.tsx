import type { Meta, StoryObj } from '@storybook/react';
import { NewTransfer } from "./NewTransfer";

const meta: Meta<typeof NewTransfer> = {
  component: NewTransfer,
};

export default meta;

type Story = StoryObj<typeof NewTransfer>;

export const Basic: Story = {};
