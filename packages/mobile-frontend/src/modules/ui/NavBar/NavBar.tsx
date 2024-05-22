import { ReactNode } from "react";
import { View, Text } from "react-native";
import tw from "twrnc";

interface Props {
  title?: ReactNode;
  leftActions?: ReactNode;
  rightActions?: ReactNode;
}

function NavBar({ title, leftActions, rightActions }: Props) {
  return (
    <View style={tw.style("flex-row items-center justify-between")}>
      <View style={tw.style("flex-row items-center flex-1")}>
        {leftActions}
        {typeof title === "string" ? (
          <Text style={tw.style("font-semibold text-gray-900 text-xl")}>
            {title}
          </Text>
        ) : (
          title
        )}
      </View>

      <View style={tw.style("flex-row")}>{rightActions}</View>
    </View>
  );
}

export default NavBar;
