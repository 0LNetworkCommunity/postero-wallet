import { ReactNode } from "react";
import { StyleProp, ViewStyle } from "react-native";
export declare enum ButtonSize {
    SM = 0,
    MD = 1,
    XL = 2,
    XXL = 3
}
export declare enum ButtonVariation {
    Primary = 0,
    Secondary = 1
}
interface Props {
    title: string;
    size?: ButtonSize;
    variation?: ButtonVariation;
    onPress: () => void;
    style?: StyleProp<ViewStyle>;
}
export declare function Button({ title, size, variation, style, onPress, }: Props): ReactNode;
export {};
