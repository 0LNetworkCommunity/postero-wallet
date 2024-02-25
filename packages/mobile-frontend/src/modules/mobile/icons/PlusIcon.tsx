import { FC } from "react";
import { TouchableOpacity } from "react-native";
import Svg, { Path } from "react-native-svg";

interface Props {
  color?: string;
  onPress?: () => void;
}

const PlusIcon: FC<Props> = ({ color, onPress }) => {
  return (
    <TouchableOpacity
      style={{
        height: 44,
        width: 44,
        marginRight: 6,
        alignItems: "center",
        justifyContent: "center"
      }}
      onPress={onPress}
    >
      <Svg height={24} width={24} viewBox="0 0 24 24">
        <Path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 4.5v15m7.5-7.5h-15"
          strokeWidth={1.5}
          stroke="#007AFF"
        />
      </Svg>
    </TouchableOpacity>
  );
};

export default PlusIcon;
