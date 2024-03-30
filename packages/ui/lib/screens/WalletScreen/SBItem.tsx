import React from "react";
import { StyleSheet, Text, View } from "react-native";
import type { ViewProps } from "react-native";
import { LongPressGestureHandler, TouchableWithoutFeedback } from "react-native-gesture-handler";
import type { AnimatedProps } from "react-native-reanimated";
import Animated from "react-native-reanimated";
import WalletCard from "./WalletCard";

interface Props extends AnimatedProps<ViewProps> {
  index?: number;
  onPress: () => void;
}

export const SBItem: React.FC<Props> = (props) => {
  const {
    style,
    index,
    testID,
    onPress,
    ...animatedViewProps
  } = props;
  return (
    <LongPressGestureHandler>
      <Animated.View testID={testID} style={{ flex: 1 }} {...animatedViewProps}>
        <View style={[styles.container]}>
          <TouchableWithoutFeedback
            style={{
              width: "100%",
              height: "100%",
            }}
            onPress={onPress}
          >
            <WalletCard />
          </TouchableWithoutFeedback>
        </View>
      </Animated.View>
    </LongPressGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 6,
  },
});
