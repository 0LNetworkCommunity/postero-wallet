import { Svg, Path } from "react-native-svg";
import { IconProps } from "./types";

export function DotsVerticalIcon({ size = 24, color = "#000000" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12,10 C13.1045847,10 14,10.8954153 14,12 C14,13.1045847 13.1045847,14 12,14 C10.8954153,14 10,13.1045847 10,12 C10,10.8954153 10.8954153,10 12,10 Z"
        fill={color}
        fillRule="nonzero"
      />
      <Path
        d="M12,3 C13.1045809,3 14,3.89543144 14,5 C14,6.10456856 13.1045809,7 12,7 C10.8954191,7 10,6.10456856 10,5 C10,3.89543144 10.8954191,3 12,3 Z"
        fill={color}
        fillRule="nonzero"
      />
      <Path
        d="M12,17 C13.1045847,17 14,17.8954153 14,19 C14,20.1045847 13.1045847,21 12,21 C10.8954153,21 10,20.1045847 10,19 C10,17.8954153 10.8954153,17 12,17 Z"
        fill={color}
        fillRule="nonzero"
      />
    </Svg>
  );
}
