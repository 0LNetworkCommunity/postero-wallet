import { View, StyleSheet } from "react-native";
import UnlockedIcon from "../../icons/UnlockedIcon";
import LockedIcon from "../../icons/LockedIcon";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  barsContainer: {
    flex: 1,
    paddingHorizontal: 4,
    paddingVertical: 6,
    flexDirection: "row",
  },
  bar: {
    borderRadius: 4,
    flex: 1,
  },
});

interface Props {
  locked?: number;
  unlocked: number;
}

function SlowWalletRatio({ locked, unlocked }: Props) {
  const total = (locked ?? 0) + unlocked;

  return (
    <View style={styles.container}>
      <UnlockedIcon />
      <View style={styles.barsContainer}>
        {unlocked > 0 && (
          <View
            style={{
              width: `${(unlocked / total) * 100}%`,
              paddingRight: locked !== undefined ? 1 : 0,
            }}
          >
            <View style={[styles.bar, { backgroundColor: "#CD3B42" }]} />
          </View>
        )}
        {locked !== undefined && (
          <View
            style={{
              width: `${(locked / total) * 100}%`,
              paddingLeft: unlocked > 0 ? 1 : 0,
            }}
          >
            <View style={[styles.bar, { backgroundColor: "#E5E5E5" }]} />
          </View>
        )}
      </View>
      <LockedIcon />
    </View>
  );
}

export default SlowWalletRatio;
