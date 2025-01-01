import { FC } from "react";
import Svg, { Path } from "react-native-svg";

interface Props {
  color: string;
}

const PlusIcon: FC<Props> = ({ color }) => {
  return (
    <Svg height={24} width={24} viewBox="0 0 24 24">
      <Path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4.5v15m7.5-7.5h-15"
        strokeWidth={1.5}
        stroke={color}
      />
    </Svg>
  );
};

export default PlusIcon;
