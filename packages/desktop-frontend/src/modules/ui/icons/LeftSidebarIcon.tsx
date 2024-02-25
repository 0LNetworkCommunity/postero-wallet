import { FC } from "react";
import Svg, { Line, G, Path, SvgProps } from "react-native-svg";

const LeftSidebarIcon: FC<Omit<SvgProps, "ref">> = (props) => {
  return (
    <Svg width="24px" height="24px" viewBox="0 0 24 24" {...props}>
      <G
        fillRule="evenodd"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <Path d="M3,8.5 L3,18.25 C3,19.4926407 4.00735931,20.5 5.25,20.5 L18.75,20.5 C19.9926407,20.5 21,19.4926407 21,18.25 L21,8.5 M3,8.5 L3,6.25 C3,5.00735931 4.00735931,4 5.25,4 L18.75,4 C19.9926407,4 21,5.00735931 21,6.25 L21,8.5 M10,4 L10,20.5 M5.5,7.5 L7.5,7.5" />
        <Line x1="5.5" y1="10" x2="7.5" y2="10" />
        <Line x1="5.5" y1="12.5" x2="7.5" y2="12.5" />
      </G>
    </Svg>
  );
};

export default LeftSidebarIcon;
