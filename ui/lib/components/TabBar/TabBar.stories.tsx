import { View } from "react-native";
import TabBar from "./TabBar";

function TabBarStory() {
  return (
    <View>
      <TabBar
        items={[
          {
            id: "overview",
            label: "Overview",
          },
          {
            id: "transactions",
            label: "Transactions",
          },
        ]}
      />
    </View>
  );
}

export default {
  title: "Tab Bar",
  component: TabBarStory,
};

export const Default = {};
