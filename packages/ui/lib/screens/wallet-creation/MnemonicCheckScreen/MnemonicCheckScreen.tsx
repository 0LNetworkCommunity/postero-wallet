import { View } from "react-native";
import { GenericScreen } from "../../../components/GenericScreen";
import {
  Button,
  ButtonSize,
  ButtonVariation,
} from "../../../components/Button";
import { TextInput } from "../../../components/TextInput";
import { Text } from "../../../components/Text";

interface Props {
  onBack?: () => void;
  onContinue?: () => void;
}

export function MnemonicCheckScreen({ onBack, onContinue }: Props) {
  return (
    <GenericScreen
      title="Let’s check your recovery phrase"
      onBack={onBack}
      body={
        <View style={{ flex: 1, padding: 16 }}>
          {[1, 5, 8, 9].map((index) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                width: "100%",
                alignItems: "center",
                paddingBottom: 16,
              }}
            >
              <Text
                text
                lg
                regular
                style={{ marginRight: 8 }}
              >{`${index}. `}</Text>
              <TextInput placeholder="Word" style={{ flex: 1 }} />
            </View>
          ))}
        </View>
      }
      footer={
        <View style={{ padding: 16 }}>
          <Button
            disabled={!onContinue}
            variation={ButtonVariation.Primary}
            size={ButtonSize.XXL}
            title="Continue"
            onPress={onContinue}
          />
        </View>
      }
    />
  );
}
