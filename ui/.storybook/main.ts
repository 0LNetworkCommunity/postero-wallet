import { StorybookConfig } from "@storybook/react-native";

const config: StorybookConfig = {
  stories: [
    "../lib/**/*.stories.?(ts|tsx|js|jsx)",
  ],
  addons: [
    "@storybook/addon-ondevice-controls",
    "@storybook/addon-ondevice-actions",
  ],
};

export default config;
