"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_gesture_handler_1 = require("react-native-gesture-handler");
const styles = react_native_1.StyleSheet.create({
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
function TabBar({ items }) {
    const [active, setActive] = (0, react_1.useState)(() => items.length > 0 ? items[0].id : undefined);
    const activeBar = (0, react_1.useRef)(new react_native_1.Animated.Value(0)).current;
    const selectedIndex = active !== undefined ? items.findIndex((item) => item.id === active) : -1;
    (0, react_1.useEffect)(() => {
        if (selectedIndex !== -1) {
            react_native_1.Animated.timing(activeBar, {
                toValue: selectedIndex,
                duration: 100,
                useNativeDriver: false,
            }).start();
        }
    }, [active]);
    return (<react_native_1.View>
      <react_native_1.View style={styles.container}>
        {items.map((item) => (<react_native_1.View key={item.id} style={styles.itemContainer}>
            <react_native_gesture_handler_1.TouchableWithoutFeedback style={styles.itemTouchContainer} onPress={() => setActive(item.id)}>
              <react_native_1.Animated.Text style={[
                styles.itemLabel,
                active === item.id && styles.itemActiveLabel,
            ]}>
                {item.label}
              </react_native_1.Animated.Text>
            </react_native_gesture_handler_1.TouchableWithoutFeedback>
          </react_native_1.View>))}
      </react_native_1.View>
      {selectedIndex !== -1 && (<react_native_1.Animated.View style={{
                position: "absolute",
                bottom: 0,
                width: `${100 / items.length}%`,
                height: 2,
                backgroundColor: "#CD3B42",
                left: activeBar.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', `${100 - 100 / items.length}%`],
                })
            }}/>)}
    </react_native_1.View>);
}
exports.default = TabBar;
//# sourceMappingURL=TabBar.js.map