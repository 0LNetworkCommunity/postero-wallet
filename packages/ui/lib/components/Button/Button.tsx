import { ReactNode, useState } from "react";
import { Pressable, Text, StyleSheet } from "react-native";

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
  text: {
    fontFamily: "SpaceGrotesk-Medium",
    fontSize: 14,
    lineHeight: 20,
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
  XXL
}

export enum ButtonVariation {
  Primary,
  Secondary,
}

interface Props {
  title: string;
  size?: ButtonSize;
  variation?: ButtonVariation;
}

const containerVariationsStyles = new Map([
  [ButtonVariation.Primary, styles.containerPrimary],
  [ButtonVariation.Secondary, styles.containerSecondary],
]);

const containerSizeStyles = new Map([
  [ButtonSize.MD, styles.containerMd],
  [ButtonSize.XL, styles.containerXl],
]);

const textVariationsStyles = new Map([
  [ButtonVariation.Primary, styles.textPrimary],
  [ButtonVariation.Secondary, styles.textSecondary],
]);

const textSizesStyles = new Map([
  [ButtonSize.MD, styles.textMd],
  [ButtonSize.XL, styles.textXl],
]);

export function Button({
  title,
  size = ButtonSize.MD,
  variation = ButtonVariation.Primary,
}: Props): ReactNode {
  const [hovered, setHovered] = useState(false);

  return (
    <Pressable
      style={[
        styles.container,
        containerSizeStyles.get(size),
        containerVariationsStyles.get(variation),
        hovered && styles.containerHover,
      ]}
      onPress={() => console.log("lol")}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
    >
      <Text
        style={[
          styles.text,
          textSizesStyles.get(size),
          textVariationsStyles.get(variation),
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}
