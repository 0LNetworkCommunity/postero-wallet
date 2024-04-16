import React from "react";
import { View } from "react-native";
import { ThemeProvider } from "@emotion/react";
import { Preview } from "@storybook/react";
import { lightTheme, darkTheme } from "../lib/theme";

const preview: Preview = {
  args: { theme: "light" },

  argTypes: {
    theme: {
      options: ["light", "dark"],
      control: {
        type: "select",
      },
    },
  },

  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },

  decorators: [
    (Story, context) => {
      return (
        <ThemeProvider
          theme={context.args.theme === "light" ? lightTheme : darkTheme}
        >
          <View
            style={{
              flex: 1,
              // backgroundColor:
              //   parameters.noBackground === true ? undefined : "#26c6da",
              padding: 8,
            }}
          >
            <Story />
          </View>
        </ThemeProvider>
      );
    },
  ],
};

export default preview;
