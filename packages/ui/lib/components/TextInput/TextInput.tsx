import { forwardRef } from "react";
import { TextInput as RNTextInput, TextInputProps, TextStyle } from "react-native";

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
  quarterary?: boolean;
}

export const TextInput = forwardRef<RNTextInput, TextInputProps & Props>(function TextInput(props, ref) {
  let {
    // display,
    // text,
    // xs,
    // sm,
    // md,
    // lg,
    // xl,
    // xxl,
    // regular,
    // medium,
    // semibold,
    // bold,

    // secondary,
    // quarterary,

    style,
    ...rnTextInputProps
  } = props;

  const textInputStyle: TextStyle = {
    borderRadius: 6,
    fontSize: 16,

    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#D6D6D6',
    backgroundColor: '#FFFFFF',
    shadowColor: 'rgba(20, 20, 20, 0.05)',
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 1 },

    paddingHorizontal: 14,
    paddingVertical: 16,
  };

  // if (xs) {
  //   textStyle.fontSize = 24;
  //   textStyle.lineHeight = 32;
  // } else if (md) {
  //   textStyle.fontSize = 16;
  //   textStyle.lineHeight = 24;
  // } else if (lg) {
  //   textStyle.fontSize = 18;
  //   textStyle.lineHeight = 28;
  // } else if (xl) {
  //   textStyle.fontSize = 60;
  //   textStyle.lineHeight = 72;
  //   textStyle.letterSpacing = -1.2;
  // } else if (xxl) {
  //   textStyle.fontSize = 72;
  //   textStyle.lineHeight = 90;
  //   textStyle.letterSpacing = -1.44;
  // }

  // if (display || text) {
  //   if (regular) {
  //     textStyle.fontFamily = fonts.primary[400];
  //   } else if (medium) {
  //     textStyle.fontFamily = fonts.primary[500];
  //   } else if (semibold) {
  //     textStyle.fontFamily = fonts.primary[600];
  //   } else if (bold) {
  //     textStyle.fontFamily = fonts.primary[700];
  //   }
  // }

  // if (secondary) {
  //   textStyle.color = '#424242';
  // } else if (quarterary) {
  //   textStyle.color = '#737373';
  // } else {
  //   // primary
  //   textStyle.color = '#141414';
  // }

  return <RNTextInput style={[textInputStyle, style]} {...rnTextInputProps} ref={ref} />;
});
