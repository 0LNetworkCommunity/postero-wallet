import React from "react";
import type { ViewProps } from "react-native";
import type { AnimatedProps } from "react-native-reanimated";
interface Props extends AnimatedProps<ViewProps> {
    index?: number;
    onPress: () => void;
}
export declare const SBItem: React.FC<Props>;
export {};
