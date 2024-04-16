import { ReactNode } from "react";
interface Props {
    items: {
        id: string;
        label: string;
    }[];
}
declare function TabBar({ items }: Props): ReactNode;
export default TabBar;
