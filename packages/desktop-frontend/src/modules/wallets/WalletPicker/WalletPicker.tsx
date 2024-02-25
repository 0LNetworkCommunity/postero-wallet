import { FC, useEffect } from "react";
import { useWallets } from "../hook";
import tw from "twrnc";
import { Picker } from "@react-native-picker/picker";

interface Props {
  value?: string;
  onChange: (value: string) => void;
}

const WalletPicker: FC<Props> = ({ value, onChange }) => {
  const wallets = useWallets();

  useEffect(() => {
    if (wallets.length && !value) {
      onChange(wallets[0].id);
    }
  }, [wallets]);

  return (
    <Picker
      style={tw.style(
        "w-full rounded-md border-0 bg-white",
        "py-1.5 px-3 text-gray-900 shadow-sm",
        "border border-gray-300",
        "focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
      )}
      selectedValue={value}
      onValueChange={(itemValue, itemIndex) => onChange(itemValue)}
    >
      {wallets.map((wallet) => (
        <Picker.Item
          key={wallet.id}
          label={wallet.label ? wallet.label : wallet.accountAddress}
          value={wallet.id}
        />
      ))}
    </Picker>
  );
};

export default WalletPicker;
