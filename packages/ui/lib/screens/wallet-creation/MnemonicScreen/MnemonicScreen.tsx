import { View } from "react-native";
import { Mnemonic as MnemonicView } from "../../../components/Mnemonic";
import { Button, ButtonSize, ButtonVariation } from "../../../components";
import { GenericScreen } from "../../../components/GenericScreen";

interface Props {
  mnemonic?: string;
  onBack?: () => void;
  onContinue?: () => void;
}

export function MnemonicScreen({ mnemonic, onBack, onContinue }: Props) {
  return (
    <GenericScreen
      title="Write down your Secret Recovery Phrase"
      subtitle="Write down this phrase on paper. You will be required to confirm it on the next step."
      onBack={onBack}
      body={
        <View style={{ flex: 1 }}>
          {mnemonic && <MnemonicView mnemonic={mnemonic} />}
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
