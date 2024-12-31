import { View } from "react-native";
import WalletBalanceChart from "./WalletBalanceChart";
import data from './data';

function WalletBalanceChartStory() {
  return (
    <View style={{ width: "100%", height: "33%" }}>
      <WalletBalanceChart
        data={data.timestamp.map((timestamp, index) => ({
          date: new Date(timestamp * 1e3),
          value: data.balance[index] / 1e6,
        }))}
      />
    </View>
  );
}

export default {
  title: "Wallet Balance Chart",
  component: WalletBalanceChartStory,
};

export const Default = {};
