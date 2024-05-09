import { FC } from "react";
import Svg, { Path } from "react-native-svg";

interface Props {
  color: string;
}

const Bars4Icon: FC<Props> = ({ color }) => {
  return (
    <Svg height={24} width={24} viewBox="0 0 24 24">
      <Path
        d="M20.5,17.75 C20.9142136,17.75 21.25,18.0857864 21.25,18.5 C21.25,18.9142136 20.9142136,19.25 20.5,19.25 L4,19.25 C3.58578644,19.25 3.25,18.9142136 3.25,18.5 C3.25,18.0857864 3.58578644,17.75 4,17.75 L20.5,17.75 Z M20.5,13.25 C20.9142136,13.25 21.25,13.5857864 21.25,14 C21.25,14.4142136 20.9142136,14.75 20.5,14.75 L4,14.75 C3.58578644,14.75 3.25,14.4142136 3.25,14 C3.25,13.5857864 3.58578644,13.25 4,13.25 L20.5,13.25 Z M20.5,8.75 C20.9142136,8.75 21.25,9.08578644 21.25,9.5 C21.25,9.91421356 20.9142136,10.25 20.5,10.25 L4,10.25 C3.58578644,10.25 3.25,9.91421356 3.25,9.5 C3.25,9.08578644 3.58578644,8.75 4,8.75 L20.5,8.75 Z M20.5,4.25 C20.9142136,4.25 21.25,4.58578644 21.25,5 C21.25,5.41421356 20.9142136,5.75 20.5,5.75 L4,5.75 C3.58578644,5.75 3.25,5.41421356 3.25,5 C3.25,4.58578644 3.58578644,4.25 4,4.25 L20.5,4.25 Z"
        fill={color}
        fillRule="nonzero"
      />
    </Svg>
  );
};

export default Bars4Icon;
