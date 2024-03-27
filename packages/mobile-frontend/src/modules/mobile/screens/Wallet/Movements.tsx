import { FC } from "react";
import { View, VirtualizedList, StyleSheet } from "react-native";
import tw from "twrnc";
import MovementItem from "./MovementItem";
import { Movement } from "../../../movements";

interface Props {
  movements: Movement[];
}

const Movements: FC<Props> = ({ movements }) => {
  return (
    <View style={tw.style("flex-1")}>
      <View style={tw.style("flex-1")}>
        <VirtualizedList<Movement>
          data={movements}
          initialNumToRender={20}
          renderItem={({ item: movement }) => (
            <MovementItem movement={movement} />
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
