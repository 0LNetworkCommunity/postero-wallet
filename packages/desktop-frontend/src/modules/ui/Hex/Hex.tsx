import { FC, useMemo } from "react";
import { View, Text } from "react-native";
import tw from "twrnc";
import xxd from "../../utils/xxd";

interface Props {
  value: Uint8Array;
}

const Hex: FC<Props> = ({ value }) => {
  const strValue = useMemo(() => xxd(value), [value]);

  return (
    <View>
      <Text>{`len = ${value.length} bytes`}</Text>

      <Text
        style={tw.style(`text-sm text-gray-700`, {
          fontFamily: "mononoki-Regular",
          userSelect: "text",
        })}
      >
        {strValue}
      </Text>
    </View>
  );
};

export default Hex;
