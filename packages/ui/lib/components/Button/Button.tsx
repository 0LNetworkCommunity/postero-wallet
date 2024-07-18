import { ReactNode, useState, createElement } from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  ViewStyle,
  View,
  RegisteredStyle,
} from "react-native";
import { Text } from "../Text";

type Falsy = undefined | null | false;
interface RecursiveArray<T>
  extends Array<T | ReadonlyArray<T> | RecursiveArray<T>> {}

type StyleList<T> =
  | RegisteredStyle<T>
  | RecursiveArray<T | RegisteredStyle<T> | Falsy>
  | Falsy;

const primaryStyles = StyleSheet.create({
  container: {
    backgroundColor: "#0F0F0F",

    shadowColor: "#141414",
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
  },
  containerDisabled: {
    backgroundColor: '#F5F5F5',
  },
  text: {
    color: "#FFFFFF",
  },
  textDisabled: {
    color: '#A3A3A3',
  }
});

const secondaryStyles = StyleSheet.create({
  container: {
    backgroundColor: "#F5F5F5",

    // shadowColor: "#141414",
    // shadowRadius: 2,
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.05,
  },
  containerDisabled: {},
  text: {
    color: "#424242",
  },
  textDisabled: {
  }
});

const styles = StyleSheet.create({
  container: {
    borderRadius: 6,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",

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

  /* SIZES */
  containerMd: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  containerLg: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  containerXl: {
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  containerXxl: {
    paddingVertical: 16,
    paddingHorizontal: 22,
  },
});

export enum ButtonSize {
  SM = "SM",
  MD = "MD",
  LG = "LG",
  XL = "XL",
  XXL = "XXL",
}

export enum ButtonVariation {
  Primary,
  Secondary,
}

interface Props {
  title: string;
  disabled?: boolean;
  size?: ButtonSize;
  variation?: ButtonVariation;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  icon?: (props: { size: number; color: string }) => ReactNode;
}

const variationsStyles = new Map([
  [ButtonVariation.Primary, primaryStyles],
  [ButtonVariation.Secondary, secondaryStyles],
]);

const containerSizeStyles = new Map<ButtonSize, ViewStyle>([
  [ButtonSize.MD, styles.containerMd],
  [ButtonSize.LG, styles.containerLg],
  [ButtonSize.XL, styles.containerXl],
  [ButtonSize.XXL, styles.containerXxl],
]);

const iconColor = new Map<ButtonVariation, string>([
  [ButtonVariation.Primary, "#FFFFFF"],
  [ButtonVariation.Secondary, "#424242"],
]);

export function Button({
  title,
  disabled,
  icon,
  size = ButtonSize.MD,
  variation = ButtonVariation.Primary,
  style,
  onPress,
}: Props): ReactNode {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const variationStyle = variationsStyles.get(variation)!;

  const containerStyle: StyleList<ViewStyle> = [
    styles.container,
    containerSizeStyles.get(size)!,
    variationStyle.container,
  ];
  if (disabled) {
    containerStyle.push(variationStyle.containerDisabled);
  } else {
    containerStyle.push(
      hovered && styles.containerHover,
      pressed && styles.containerPressed
    );
  }

  containerStyle.push(style);

  return (
    <Pressable
      style={containerStyle}
      onPress={onPress}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
    >
      {icon && (
        <View style={{ marginRight: 6 }}>
          {createElement(icon, { size: 20, color: iconColor.get(variation)! })}
        </View>
      )}
      <Text
        medium
        text
        sm={size === ButtonSize.SM}
        md={size === ButtonSize.MD || size === ButtonSize.LG}
        lg={size === ButtonSize.XXL}
        style={[variationStyle.text, disabled && variationStyle.textDisabled]}
      >
        {title}
      </Text>
    </Pressable>
  );
}
