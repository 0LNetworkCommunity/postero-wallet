import { StorybookConfig } from "@storybook/react-native";

const config: StorybookConfig = {
  stories: [
    // "../components/**/*.stories.?(ts|tsx|js|jsx)",
    "../lib/**/*.stories.?(ts|tsx|js|jsx)",
  ],
  addons: [
    "@storybook/addon-ondevice-controls",
    "@storybook/addon-ondevice-actions",
  ],
};

export default config;