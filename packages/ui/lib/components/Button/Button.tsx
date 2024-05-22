import { ReactNode, useState, createElement } from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  ViewStyle,
  View,
  RegisteredStyle,
} from "react-native";
import Text from "../Text";

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
  SM = "SM",
  MD = "MD",
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
  [ButtonSize.XL, styles.containerXl],
  [ButtonSize.XXL, styles.containerXxl],
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
          {createElement(icon, { size: 20, color: "#424242" })}
        </View>
      )}
      <Text
        medium
        text
        lg={size === ButtonSize.XXL}
        style={[variationStyle.text, disabled && variationStyle.textDisabled]}
      >
        {title}
      </Text>
    </Pressable>
  );
}
