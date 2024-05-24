import { TouchableOpacity, View } from "react-native";
import { ReactNode } from "react";

import Text from "../../components/Text";
import { AmountInput } from "../../components/AmountInput";
import { TextInput } from "../../components/TextInput";
import XCloseIcon from "../../icons/XCloseIcon";
import QrScanIcon from "../../icons/QrScanIcon";
import { Button, ButtonSize, ButtonVariation } from "../../components/Button";
import { ArrowNarrowLeftIcon } from "../../icons/ArrowNarrowLeftIcon";
import { IconProps } from "../../icons/types";

interface Props {
  onBack?: () => void;
  onScan?: () => void;
  onConfirm?: (details: { amount: string; recipient: string }) => void;
  available?: string;

  amount: string;
  onChangeAmount: (amount: string) => void;

  recipient: string;
  onChangeRecipient: (recipient: string) => void;
}

export function NewTransfer({
  available,
  onBack,
  onScan,
  onConfirm,
  amount,
  onChangeAmount,
  recipient,
  onChangeRecipient,
}: Props) {
  const icons: {
    icon: (props: IconProps) => ReactNode;
    onPress: () => void;
  }[] = [];

  if (onScan) {
    icons.push({
      icon: QrScanIcon,
      onPress: onScan,
    });
  }

  icons.push({
    icon: XCloseIcon,
    onPress: () => onChangeRecipient(""),
  });

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: "row" }}>
        {onBack && (
          <TouchableOpacity onPress={onBack}>
            <View style={{ padding: 18 }}>
              <ArrowNarrowLeftIcon color="#525252" size={20} />
            </View>
          </TouchableOpacity>
        )}
        <View style={{ padding: 16, paddingLeft: onBack ? 0 : 16 }}>
          <Text text md medium>
            Send LIBRA
          </Text>
          {available && (
            <Text text sm regular tertiary>
              {`Available: ${available}`}
            </Text>
          )}
        </View>
      </View>

      <View style={{ paddingVertical: 20, paddingHorizontal: 16, flexGrow: 1 }}>
        <AmountInput value={amount} onChange={onChangeAmount} />

        <TextInput
          label="Recipient"
          value={recipient}
          onChangeText={onChangeRecipient}
          style={{ marginTop: 16 }}
          icons={icons}
          autoCapitalize="characters"
          autoComplete="off"
          autoCorrect={false}
          inputMode="text"
        />
      </View>

      <View style={{ paddingHorizontal: 16, paddingVertical: 20 }}>
        <Button
          title="Next"
          size={ButtonSize.XXL}
          variation={ButtonVariation.Primary}
          onPress={() => {
            onConfirm?.({
              amount,
              recipient,
            });
          }}
        />
      </View>
    </View>
  );
}
