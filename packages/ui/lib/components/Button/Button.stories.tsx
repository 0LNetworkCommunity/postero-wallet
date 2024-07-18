import type { Meta, StoryObj } from "@storybook/react";
import { Button, ButtonSize, ButtonVariation } from "./Button";
import { View } from "react-native";

const meta: Meta<typeof Button> = {
  // title: 'Button',
  component: () => {
    return (
      <View>
        <View style={{ marginBottom: 8 }}>
          <Button
            size={ButtonSize.LG}
            variation={ButtonVariation.Secondary}
            title="Import seed phrase"
          />
        </View>
        <View style={{ marginBottom: 8 }}>
          <Button
            size={ButtonSize.LG}
            variation={ButtonVariation.Secondary}
            title="Import private key"
          />
        </View>
        <View style={{ marginBottom: 8 }}>
          <Button
            size={ButtonSize.XXL}
            variation={ButtonVariation.Primary}
            title="Create a new wallet"
          />
        </View>
      </View>
    );
  },
  // argTypes: {
  //   title: {
  //     control: "text",
  //   },
  //   size: {
  //     options: [
  //       ButtonSize.SM,
  //       ButtonSize.MD,
  //       ButtonSize.LG,
  //       ButtonSize.XL,
  //       ButtonSize.XXL,
  //     ],
  //     control: {
  //       type: "select",
  //       labels: {
  //         [ButtonSize.SM]: "SM",
  //         [ButtonSize.MD]: "MD",
  //         [ButtonSize.LG]: "LG",
  //         [ButtonSize.XL]: "XL",
  //         [ButtonSize.XXL]: "XXL",
  //       },
  //     },
  //   },
  //   variation: {
  //     options: [ButtonVariation.Primary, ButtonVariation.Secondary],
  //     control: {
  //       type: "select",
  //       labels: {
  //         [ButtonVariation.Primary]: "Primary",
  //         [ButtonVariation.Secondary]: "Secondary",
  //       },
  //     },
  //   },
  // },
  args: {
    title: "Title",
    variation: ButtonVariation.Secondary,
    size: ButtonSize.MD,
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Basic: Story = {};
