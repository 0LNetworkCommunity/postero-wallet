import { ReactNode } from "react";
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
}
export declare function Button({ title, size, variation, }: Props): ReactNode;
export {};
