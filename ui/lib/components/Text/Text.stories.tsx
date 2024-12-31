import { ScrollView, View } from "react-native";
import { Text } from "./Text";

function TextStory() {
  return (
    <ScrollView style={{ flex: 1 }}>
      <View>
        <Text display xxl regular>
          Display 2xl Regular
        </Text>
        <Text display xxl medium>
          Display 2xl Medium
        </Text>
        <Text display xxl semibold>
          Display 2xl Semibold
        </Text>
        <Text display xxl bold>
          Display 2xl Bold
        </Text>

        <Text display xl regular>
          Display xl Regular
        </Text>
        <Text display xl medium>
          Display xl Medium
        </Text>
        <Text display xl semibold>
          Display xl Semibold
        </Text>
        <Text display xxl bold>
          Display xl Bold
        </Text>

        <Text display lg regular>
          Display lg Regular
        </Text>
        <Text display lg medium>
          Display lg Medium
        </Text>
        <Text display lg semibold>
          Display lg Semibold
        </Text>
        <Text display lg bold>
          Display lg Bold
        </Text>

        <Text display md regular>
          Display md Regular
        </Text>
        <Text display md medium>
          Display md Medium
        </Text>
        <Text display md semibold>
          Display md Semibold
        </Text>
        <Text display md bold>
          Display md Bold
        </Text>
      </View>
    </ScrollView>
  );
}

export default {
  title: "Text",
  component: TextStory,
};

export const Default = {};
