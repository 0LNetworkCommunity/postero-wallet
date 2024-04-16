/// <reference types="react" />
interface Props {
    data: {
        date: Date;
        value: number;
    }[];
}
declare function WalletBalanceChart({ data }: Props): import("react").JSX.Element;
export default WalletBalanceChart;
