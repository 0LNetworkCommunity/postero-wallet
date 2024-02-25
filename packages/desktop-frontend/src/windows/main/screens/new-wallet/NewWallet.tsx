import React, { FC } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { StackNavigationProp } from '@react-navigation/stack';
import { gql, useMutation } from "@apollo/client";
import { Wordlist, LangEn, Mnemonic, randomBytes } from 'ethers';
import { BlurView } from 'expo-blur';
import tw from 'twrnc';
import { XMarkIcon } from '@heroicons/react/24/outline'
import ImportWallet from "./ImportWallet";
import Button from "../../../../modules/ui/Button";

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 1)',
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    appRegion: 'drag',
  },
});

const defaultPath = "m/44'/637'/0'/0'/0'";

const createRandom = (password?: string, path?: string, wordlist?: Wordlist): string => {
  if (password == null) {
    password = "";
  }
  if (path == null) {
    path = defaultPath;
  }
  if (wordlist == null) {
    wordlist = LangEn.wordlist();
  }
  const mnemonic = Mnemonic.fromEntropy(randomBytes(32), password, wordlist)
  return mnemonic.phrase;
};

const NEW_WALLET = gql`
  mutation NewWallet {
    newWallet {
      id
    }
  }
`;

const NewWallet: FC<{
  navigation: StackNavigationProp<any>;
}> = ({ navigation }) => {
  const [newWallet, { data, loading, error }] = useMutation(NEW_WALLET);

  const onNewWallet = async () => {
    await newWallet();
    navigation.goBack();
  };

  return (
    <BlurView intensity={15} tint="dark" style={styles.overlay}>
      <View
        style={tw.style(
          "bg-white rounded-lg",
          "px-4 pb-4 pt-5",
          "shadow-xl",
          "relative",

          {
            width: 500,
            appRegion: "no-drag",
          }
        )}
      >
        <View style={tw`absolute right-0 top-0 pr-4 pt-4`}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <View
              style={tw.style(
                "rounded-md bg-white",
                "text-gray-400",
                "hover:text-gray-500",
                "focus:outline-none focus:ring-2",
                "focus:ring-indigo-500 focus:ring-offset-2"
              )}
            >
              <XMarkIcon style={tw`h-6 w-6`} />
            </View>
          </TouchableOpacity>
        </View>

        <View>
          <ImportWallet />
        </View>

        <Button onPress={onNewWallet}>New Wallet</Button>
        <Button onPress={() => navigation.goBack()}>Dismiss</Button>
      </View>
    </BlurView>
  );
};

export default NewWallet;
