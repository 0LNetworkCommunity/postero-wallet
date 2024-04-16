import type { Meta, StoryObj } from '@storybook/react';
import { Button, ButtonSize, ButtonVariation } from './Button';

const meta: Meta<typeof Button> = {
  // title: 'Button',
  component: Button,
  argTypes: {
    title: {
      control: "text",
    },
    size: {
      options: [ButtonSize.SM, ButtonSize.MD, ButtonSize.XL, ButtonSize.XXL],
      control: {
        type: "select",
        labels: {
          [ButtonSize.SM]: "SM",
          [ButtonSize.MD]: "MD",
          [ButtonSize.XL]: "XL",
          [ButtonSize.XXL]: "XXL",
        },
      },
    },
    variation: {
      options: [ButtonVariation.Primary, ButtonVariation.Secondary],
      control: {
        type: "select",
        labels: {
          [ButtonVariation.Primary]: "Primary",
          [ButtonVariation.Secondary]: "Secondary",
        },
      },
    },
  },
  args: {
    title: "Title",
    variation: ButtonVariation.Secondary,
    size: ButtonSize.MD,
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Basic: Story = {};