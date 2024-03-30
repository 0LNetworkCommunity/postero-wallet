import { View, StyleSheet } from "react-native";
import { SlowWalletRatio } from "./SlowWalletRatio";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "50%",
  },
});

function SlowWalletRatioStory() {
  const color = "#525252";
  const size = 32;

  return (
    <View style={styles.container}>
      <SlowWalletRatio unlocked={50_000} locked={100_000} />
    </View>
  );
}

export default {
  title: "SlowWalletRatio",
  component: SlowWalletRatioStory,
};

export const Default = {};
