import { forwardRef } from "react";
import { Text as RNText, TextProps, TextStyle } from "react-native";
import { fonts } from "../../theme";

interface Props {
  display?: boolean;
  text?: boolean;

  xs?: boolean;
  sm?: boolean;
  md?: boolean;
  lg?: boolean;
  xl?: boolean;
  xxl?: boolean;

  regular?: boolean;
  medium?: boolean;
  semibold?: boolean;
  bold?: boolean;

  secondary?: boolean;
  tertiary?: boolean;
  quarterary?: boolean;
}

export const Text = forwardRef<RNText, TextProps & Props>(function Text(props, ref) {
  let {
    display,
    text,
    xs,
    sm,
    md,
    lg,
    xl,
    xxl,
    regular,
    medium,
    semibold,
    bold,

    secondary,
    tertiary,
    quarterary,

    style,
    ...rnTextProps
  } = props;

  const textStyle: TextStyle = {};

  if (xs) {
    textStyle.fontSize = 24;
    textStyle.lineHeight = 32;
  } else if (md) {
    textStyle.fontSize = 16;
    textStyle.lineHeight = 24;
  } else if (lg) {
    textStyle.fontSize = 18;
    textStyle.lineHeight = 28;
  } else if (xl) {
    textStyle.fontSize = 60;
    textStyle.lineHeight = 72;
    textStyle.letterSpacing = -1.2;
  } else if (xxl) {
    textStyle.fontSize = 72;
    textStyle.lineHeight = 90;
    textStyle.letterSpacing = -1.44;
  }

  if (display || text) {
    if (regular) {
      textStyle.fontFamily = fonts.primary[400];
    } else if (medium) {
      textStyle.fontFamily = fonts.primary[500];
    } else if (semibold) {
      textStyle.fontFamily = fonts.primary[600];
    } else if (bold) {
      textStyle.fontFamily = fonts.primary[700];
    }
  }

  if (secondary) {
    textStyle.color = '#424242';
  } else if (tertiary) {
    textStyle.color = '#525252';
  } else if (quarterary) {
    textStyle.color = '#737373';
  } else {
    // primary
    textStyle.color = '#141414';
  }

  return <RNText style={[textStyle, style]} {...rnTextProps} ref={ref} />;
});
