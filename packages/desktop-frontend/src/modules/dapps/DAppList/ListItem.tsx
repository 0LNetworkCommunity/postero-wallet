import { FC } from "react";
import { View, Text, Image } from "react-native";
import tw from "twrnc";
import { Buffer } from "buffer";

import { DApp, DAppStatus } from "../types";

interface Props {
  active: boolean;
  dApp: DApp;
}

const ListItem: FC<Props> = ({ active, dApp }) => {
  const icon = Buffer.from(dApp.icon!, "hex").toString("base64");
  return (
    <View
      style={tw.style(
        "flex-row",
        "px-2 py-2",
        "border-b border-gray-900/5",
        active && "bg-blue-600"
      )}
    >
      <View style={tw.style("pr-2 items-center justify-center")}>
        <View
          style={tw.style(
            "h-12 w-12 rounded-lg bg-white",
            "items-center justify-center"
          )}
        >
          <Image
            resizeMode="contain"
            style={tw.style("w-10 h-10")}
            source={{
              uri: `data:image/svg+xml;base64,${icon}`,
            }}
          />
        </View>
      </View>

      <View style={tw.style("flex-1 flex-auto")}>
        <Text
          style={tw.style(
            "text-sm font-semibold leading-6 text-gray-900",
            active && "text-white"
          )}
          numberOfLines={1}
          ellipsizeMode="middle"
        >
          {dApp.name}
        </Text>
        <Text
          style={tw.style(
            "mt-1 text-xs leading-5 text-gray-500",
            active && "text-white"
          )}
          numberOfLines={1}
          ellipsizeMode="middle"
        >
          {dApp.host}
        </Text>
      </View>
      <View style={tw.style("items-center justify-center")}>
        {dApp.status === DAppStatus.Connected && (
          <View
            style={tw.style(
              "flex-none rounded-full p-1 text-green-400 bg-green-400/10"
            )}
          >
            <View style={tw.style("h-1.5 w-1.5 rounded-full bg-current")} />
          </View>
        )}
      </View>
    </View>
  );
};

export default ListItem;
