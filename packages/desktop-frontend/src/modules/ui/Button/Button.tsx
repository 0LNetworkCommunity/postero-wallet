import { FC, PropsWithChildren, ReactNode, useState } from "react";
import { Pressable, View, Text, StyleProp, ViewStyle } from "react-native";
import tw from "twrnc";

type Props = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  children: ReactNode | string;
}>;

const Button: FC<Props> = ({ style, children, onPress }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Pressable
      onPress={onPress}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      style={[
        tw.style(
          "rounded shadow px-3 py-0.5 bg-blue-500 justify-center",
          hovered && "bg-blue-400",
          hovered
            ? {
                boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
              }
            : {
                boxShadow:
                  "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
              }
        ),
        style,
      ]}
    >
      {typeof children === "string" ? (
        <Text style={tw.style("text-white font-semibold text-center")}>{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
};

export default Button;
