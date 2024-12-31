import { useState } from "react";
import { LayoutChangeEvent, LayoutRectangle, View } from "react-native";
import Slider from "./Slider";

function Wrapper() {
  const [rect, setRect] = useState<LayoutRectangle>();

  const onLayout = (event: LayoutChangeEvent) => {
    setRect(event.nativeEvent.layout);
  };

  return (
    <View style={{ flex: 1 }} onLayout={onLayout}>
      {rect && <Slider width={rect.width} height={rect.height} />}
    </View>
  );
}

export default Wrapper;
