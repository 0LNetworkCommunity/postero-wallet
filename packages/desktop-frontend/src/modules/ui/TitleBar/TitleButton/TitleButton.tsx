import { PropsWithChildren, forwardRef, useState } from "react";
import { View, Pressable, GestureResponderEvent } from "react-native";
import tw from "twrnc";
import { useWindowState } from "../../../window-state";
import { WindowState } from "../../../window-state/types";

type Props = PropsWithChildren<{
  onPress: (event: GestureResponderEvent) => void;
}>;

const TitleBarButton = forwardRef<View, Props>(({ children, onPress }, ref) => {
  const [hover, setHover] = useState(false);
  const { windowState } = useWindowState();

  return (
    <View
      ref={ref}
      style={tw.style({
        userSelect: "none",
        appRegion: "no-drag",
      })}
    >
      <Pressable
        onPress={onPress}
        onHoverIn={() => setHover(true)}
        onHoverOut={() => setHover(false)}
      >
        <View
          style={tw.style(
            windowState === WindowState.Background && {
              opacity: 0.5,
            },
            "text-slate-600",
            {
              borderRadius: 6,
              paddingTop: 4,
              paddingBottom: 4,
              paddingRight: 6,
              paddingLeft: 6,
              flexDirection: "row",
              alignItems: "center",
            },
            hover && {
              backgroundColor: "rgba(0, 0, 0, 0.05)",
            }
          )}
        >
          {children}
        </View>
      </Pressable>
    </View>
  );
});

export default TitleBarButton;
