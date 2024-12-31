import type { Meta, StoryObj } from '@storybook/react';
import { SplashScreen } from "./SplashScreen";

const meta: Meta<typeof SplashScreen> = {
  component: SplashScreen,
};

export default meta;

type Story = StoryObj<typeof SplashScreen>;

export const Basic: Story = {};
