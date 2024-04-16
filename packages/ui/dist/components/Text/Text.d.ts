/// <reference types="react" />
import { Text as RNText, TextProps } from "react-native";
interface Props {
    display?: boolean;
    text?: boolean;
    xs?: boolean;
    sm?: boolean;
    md?: boolean;
    lg?: boolean;
    xl?: boolean;
    xxl?: boolean;
    regular?: boolean;
    medium?: boolean;
    semibold?: boolean;
    bold?: boolean;
}
declare const Text: import("react").ForwardRefExoticComponent<TextProps & Props & import("react").RefAttributes<RNText>>;
export default Text;
