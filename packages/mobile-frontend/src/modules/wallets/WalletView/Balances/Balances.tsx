import { FC } from "react";
import { View, Text } from "react-native";
import tw from "twrnc";

import { Balance } from "../../types";

interface Props {
  balances: Balance[];
}

const Balances: FC<Props> = ({ balances }) => {
  return (
    <View>
      <View style={tw.style("pb-1")}>
        <Text style={tw.style("text-sm font-medium text-gray-900")}>
          Balances
        </Text>
      </View>
      {balances.map((balance) => {
        const amount = parseInt(balance.amount, 10);
        const decimals = balance.coin.decimals;
        const value = amount / Math.pow(10, decimals);

        return (
          <View
            key={`${balance.amount}-${balance.coin.id}`}
            style={tw.style("flex-row justify-between")}
          >
            <View style={tw.style("pr-2")}>
              <Text style={tw.style("font-medium text-gray-500")}>
                {balance.coin.symbol}
              </Text>
            </View>
            <View>
              <Text
                style={tw.style("text-gray-900", {
                  fontFamily: "mononoki-Bold",
                })}
              >
                {value.toLocaleString()}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default Balances;
