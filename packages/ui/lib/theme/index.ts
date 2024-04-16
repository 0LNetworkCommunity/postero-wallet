import { Theme } from "@emotion/react";
import { Fonts } from "./types";

export const fonts: Fonts = {
  primary: {
    300: "SpaceGrotesk-Light",
    400: "SpaceGrotesk-Regular",
    500: "SpaceGrotesk-Medium",
    700: "SpaceGrotesk-Bold",
  },
};

export const darkTheme: Theme = {
  colors: {
    text: {
      primary: {
        900: '#F5F5F6',
      },
    },
    bgPrimary: '#0C111D',
    primary: '',
  },
};

export const lightTheme: Theme = {
  colors: {
    text: {
      primary: {
        900: '#141414',
      },
    },
    bgPrimary: '#FFFFFF',
    primary: '',
  },
};