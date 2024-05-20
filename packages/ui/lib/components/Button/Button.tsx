import { ReactNode, useState } from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from "react-native";
import Text from "../Text";

const styles = StyleSheet.create({
  container: {
    borderRadius: 6,
    justifyContent: "center",
    flexDirection: "row",

    shadowColor: "#141414",
    shadowOpacity: 0.05,
    shadowRadius: 1,
    shadowOffset: {
      width: 0,
      height: 1,
    },
  },

  containerHover: {
    backgroundColor: "#292929",
  },
  containerPressed: {
    opacity: 0.8,
  },

  /* VARIATIONS */
  containerPrimary: {
    backgroundColor: "#0F0F0F",
  },
  containerSecondary: {
    backgroundColor: "#F5F5F5",
  },
  textPrimary: {
    color: "#FFFFFF",
  },
  textSecondary: {
    color: "#424242",
  },

  /* SIZES */

  containerMd: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  containerXl: {
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  containerXxl: {
    paddingVertical: 16,
    paddingHorizontal: 22,
  },

  textMd: {
    fontSize: 14,
    lineHeight: 20,
  },
  textXl: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export enum ButtonSize {
  SM,
  MD,
  XL,
  XXL,
}

export enum ButtonVariation {
  Primary,
  Secondary,
}

interface Props {
  title: string;
  size?: ButtonSize;
  variation?: ButtonVariation;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

const containerVariationsStyles = new Map([
  [ButtonVariation.Primary, styles.containerPrimary],
  [ButtonVariation.Secondary, styles.containerSecondary],
]);

const containerSizeStyles = new Map([
  [ButtonSize.MD, styles.containerMd],
  [ButtonSize.XL, styles.containerXl],
  [ButtonSize.XXL, styles.containerXxl],
]);

const textVariationsStyles = new Map([
  [ButtonVariation.Primary, styles.textPrimary],
  [ButtonVariation.Secondary, styles.textSecondary],
]);

export function Button({
  title,
  size = ButtonSize.MD,
  variation = ButtonVariation.Primary,
  style,
  onPress,
}: Props): ReactNode {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  return (
    <Pressable
      style={[
        styles.container,
        containerSizeStyles.get(size),
        containerVariationsStyles.get(variation),
        hovered && styles.containerHover,
        pressed && styles.containerPressed,
        style,
      ]}
      onPress={onPress}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
    >
      <Text
        medium
        text
        lg={size === ButtonSize.XXL}
        style={[textVariationsStyles.get(variation)]}
      >
        {title}
      </Text>
    </Pressable>
  );
}
