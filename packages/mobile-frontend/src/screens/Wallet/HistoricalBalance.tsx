import { FC } from "react";
import { View } from "react-native";
import Svg, { Circle, Rect } from 'react-native-svg';

const HistoricalBalance: FC = () => {
  return (
    <View>
      <Svg height={100} width={100} viewBox="0 0 100 100">
        <Circle cx="50" cy="50" r="45" stroke="blue" strokeWidth="2.5" fill="green" />
        <Rect x="15" y="15" width="70" height="70" stroke="red" strokeWidth="2" fill="yellow" />
      </Svg>
    </View>
  );
};

export default HistoricalBalance;
