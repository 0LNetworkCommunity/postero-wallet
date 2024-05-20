import { forwardRef } from "react";
import { View, ViewProps, StyleSheet } from "react-native";

const Separator = forwardRef<View, ViewProps>(function Separator(
  { style, ...props },
  ref
) {
  return <View style={[styles.separator, style]} {...props} ref={ref} />;
});

const styles = StyleSheet.create({
  separator: {
    height: 1,
    width: "100%",
    backgroundColor: "#D6D6D6",
  },
});

export default Separator;
