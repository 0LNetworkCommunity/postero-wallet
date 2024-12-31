import { ReactNode, useEffect, useRef, useState } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
  },
  itemContainer: {
    flexBasis: 0,
    flexGrow: 1,
  },
  itemTouchContainer: {
    paddingBottom: 12,
    width: "100%",
    alignItems: "center",
    borderBottomWidth: 1,
    borderStyle: "solid",
    borderColor: "#E5E5E5",
  },
  itemLabel: {
    color: "#737373",
    fontFamily: "SpaceGrotesk-Medium",
    fontSize: 14,
    lineHeight: 20,
  },
  itemActiveLabel: {
    color: "#141414",
  },
});

interface Props {
  items: {
    id: string;
    label: string;
  }[];
}

function TabBar({ items }: Props): ReactNode {
  const [active, setActive] = useState<string | undefined>(() =>
    items.length > 0 ? items[0].id : undefined
  );
  const activeBar = useRef(new Animated.Value(0)).current;

  const selectedIndex =
    active !== undefined ? items.findIndex((item) => item.id === active) : -1;

  useEffect(() => {
    if (selectedIndex !== -1) {
      Animated.timing(activeBar, {
        toValue: selectedIndex,
        duration: 100,
        useNativeDriver: false,
      }).start();
    }
  }, [active]);

  return (
    <View>
      <View style={styles.container}>
        {items.map((item) => (
          <View key={item.id} style={styles.itemContainer}>
            <TouchableWithoutFeedback
              style={styles.itemTouchContainer}
              onPress={() => setActive(item.id)}
            >
              <Animated.Text
                style={[
                  styles.itemLabel,
                  active === item.id && styles.itemActiveLabel,
                ]}
              >
                {item.label}
              </Animated.Text>
            </TouchableWithoutFeedback>
          </View>
        ))}
      </View>
      {selectedIndex !== -1 && (
        <Animated.View
          style={{
            position: "absolute",
            bottom: 0,
            width: `${100 / items.length}%`,
            height: 2,
            backgroundColor: "#CD3B42",
            left: activeBar.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', `${100 - 100 / items.length}%`],
            })
          }}
        />
      )}
    </View>
  );
}

export default TabBar;
