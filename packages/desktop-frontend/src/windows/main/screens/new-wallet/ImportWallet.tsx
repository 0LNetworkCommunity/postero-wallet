import { FC, useState } from "react";
import { View, Text, TextInput } from "react-native";
import tw from "twrnc";
import Button from "../../../../modules/ui/Button";
import store from "../../../../modules/store/store";

const ImportWallet: FC = () => {
  const [mnemonic, setMnemonic] = useState('');

  const importWallet = () => {
    store.importWallet(mnemonic);
  };

  return (
    <View>
      <Text>Import</Text>
      <TextInput
        value={mnemonic}
        onChangeText={(value) => setMnemonic(value)}
        placeholder="Mnemonic"
        secureTextEntry
        style={tw.style(
          "block w-full",
          "p-1.5",
          "rounded-md border-1 text-gray-900 shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        )}
      />
  
      <Button onPress={importWallet}>Import wallet</Button>
    </View>
  );
};

export default ImportWallet;
