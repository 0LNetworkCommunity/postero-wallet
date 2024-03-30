import { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import EyeIcon from "../../icons/EyeIcon";
import EyeOffIcon from "../../icons/EyeOffIcon";
import QrScanIcon from "../../icons/QrScanIcon";
import SwitchVerticalIcon from "../../icons/SwitchVerticalIcon";
import Button from "../../components/Button";
import WalletsCarousel from "./WalletsCarousel";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  balanceVisibilityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  balanceVisibilityLabel: {
    color: "#B7353B",
    marginLeft: 6,
    fontFamily: "SpaceGrotesk-Medium",
    fontSize: 14,
    lineHeight: 20,
  },
  topBarContainer: {
    height: 44,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  totalBalanceLabel: {
    fontFamily: "SpaceGrotesk-Medium",
    fontSize: 14,
    lineHeight: 20,
    color: "#737373",
  },

  totalBalancePrimaryValue: {
    fontFamily: "SpaceGrotesk-Light",
    fontSize: 36,
    lineHeight: 44,
    color: "#141414",
  },

  totalBalanceSecondaryValue: {
    fontFamily: "SpaceGrotesk-Regular",
    fontSize: 14,
    lineHeight: 24,
    color: "#525252",
  },

  ball: {
    width: 100,
    height: 100,
    borderRadius: 100,
    backgroundColor: 'blue',
    alignSelf: 'center',
  },
});

function WalletScreen() {
  const [balanceVisible, setBalanceVisible] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ width: "100%", padding: 20 }}>
        <View style={styles.topBarContainer}>
          <TouchableOpacity onPress={() => setBalanceVisible(!balanceVisible)}>
            {balanceVisible ? (
              <View style={styles.balanceVisibilityContainer}>
                <EyeOffIcon color="#B7353B" size={20} />
                <Text style={styles.balanceVisibilityLabel}>Hide balance</Text>
              </View>
            ) : (
              <View style={styles.balanceVisibilityContainer}>
                <EyeIcon color="#B7353B" size={20} />
                <Text style={styles.balanceVisibilityLabel}>Show balance</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity>
            <QrScanIcon color="#525252" size={20} />
          </TouchableOpacity>
        </View>

        <View style={{ marginBottom: 24 }}>
          <View>
            <Text style={styles.totalBalanceLabel}>Total balance</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.totalBalancePrimaryValue}>$112,259.90</Text>

            <TouchableOpacity style={{ marginLeft: 8 }}>
              <SwitchVerticalIcon size={20} color="#525252" />
            </TouchableOpacity>
          </View>
          <View>
            <Text style={styles.totalBalanceSecondaryValue}>
              9,685,928.113 Ƚ
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", width: "100%" }}>
          <View style={{ width: "50%", paddingRight: 4 }}>
            <Button title="Send" />
          </View>
          <View style={{ width: "50%", paddingRight: 4 }}>
            <Button title="Receive" />
          </View>
        </View>
      </View>

      <View style={{ flex: 1 }}>
        <WalletsCarousel />
      </View>

    </SafeAreaView>
  );
}

export default WalletScreen;
