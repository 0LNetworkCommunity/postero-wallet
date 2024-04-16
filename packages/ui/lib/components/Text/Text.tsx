import { forwardRef } from "react";
import { Text as RNText, TextProps, StyleSheet, TextStyle } from "react-native";
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
}

const Text = forwardRef<RNText, TextProps & Props>(function Text(props, ref) {
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
    ...rnTextProps
  } = props;

  const style: TextStyle = {};


  if (md) {
    style.fontSize = 36;
    style.lineHeight = 44;
    style.letterSpacing = -0.72;
  } else if (lg) {
    style.fontSize = 48;
    style.lineHeight = 60;
    style.letterSpacing = -0.96;
  } else if (xl) {
    style.fontSize = 60;
    style.lineHeight = 72;
    style.letterSpacing = -1.2;
  } else if (xxl) {
    style.fontSize = 72;
    style.lineHeight = 90;
    style.letterSpacing = -1.44;
  }

  if (display) {
    if (regular) {
      style.fontFamily = fonts.primary[400];
    } else if (medium) {
      style.fontFamily = fonts.primary[500];
    } else if (semibold) {
      style.fontFamily = fonts.primary[600];
    } else if (bold) {
      style.fontFamily = fonts.primary[700];
    }
  }


  return <RNText style={style} {...rnTextProps} ref={ref} />;
});

export default Text;
