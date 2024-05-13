import { FC } from "react";
import {
  View,
  VirtualizedList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import tw from "twrnc";
import MovementItem from "./MovementItem";
import { Movement } from "../../../movements";
import { useNavigation } from "@react-navigation/native";

interface Props {
  movements: Movement[];
}

const Movements: FC<Props> = ({ movements }) => {
  const navigation = useNavigation<any>();

  return (
    <View style={tw.style("flex-1")}>
      <View style={tw.style("flex-1")}>
        <VirtualizedList<Movement>
          data={movements}
          initialNumToRender={20}
          renderItem={({ item: movement }) => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Transaction");
              }}
            >
              <MovementItem movement={movement} />
            </TouchableOpacity>
          )}
          keyExtractor={(movement) => movement.version.toString()}
          getItemCount={(movements: Movement[]) => movements.length}
          getItem={(movements: Movement[], index) => movements[index]}
          ItemSeparatorComponent={() => (
            <View
              style={tw.style("w-full bg-gray-300", {
                height: StyleSheet.hairlineWidth,
              })}
            />
          )}
        />
      </View>
    </View>
  );
};

export default Movements;
