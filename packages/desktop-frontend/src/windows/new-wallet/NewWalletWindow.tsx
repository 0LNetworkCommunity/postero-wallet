import { FC, useMemo } from "react";
import { View, Text, Pressable } from "react-native";
import tw from "twrnc";
import { gql, useApolloClient } from "@apollo/client";
import { Wordlist, LangEn, Mnemonic, randomBytes } from "ethers";
import _ from "lodash";
import Button from "../../modules/ui/Button";

const message = [
  "A crypto mnemonic is a unique sequence of words that is a backup ",
  "for your cryptographic keys. Think of it as a passphrase that ",
  "encapsulates the essence of your digital wallet. This mnemonic is ",
  "crucial for recovering your wallet and accessing your funds in ",
  "case of device loss or failure. ",
  "\n\n",
  "Remember: treat your crypto mnemonic like a digital treasure map. ",
  "Keep it private and secure, and never share it with anyone. Losing ",
  "your mnemonic could mean losing access to your assets. Store it ",
  "safely in an offline location.",
  "\n\n",
].join("");

const CLOSE_WINDOW = gql`
  mutation CloseWindow {
    closeWindow
  }
`;

const IMPORT_WALLET = gql`
  mutation ImportWallet($mnemonic: String!) {
    importWallet(mnemonic: $mnemonic)
  }
`;

const createRandom = (
  password?: string,
  wordlist?: Wordlist
): string => {
  if (password == null) {
    password = "";
  }
  if (wordlist == null) {
    wordlist = LangEn.wordlist();
  }
  const mnemonic = Mnemonic.fromEntropy(randomBytes(32), password, wordlist);
  return mnemonic.phrase;
};

const NewWalletWindow: FC = () => {
  const apolloClient = useApolloClient();
  const mnemonic = useMemo(() => {
    return _.chunk(createRandom().toUpperCase().split(" "), 6);
  }, []);

  const onCancel = async () => {
    await apolloClient.mutate({
      mutation: CLOSE_WINDOW,
    });
  };

  const onCreate = async () => {
    const res = await apolloClient.mutate({
      mutation: IMPORT_WALLET,
      variables: {
        mnemonic: _.flatMap(mnemonic).join(" "),
      },
    });
    console.log(res);
    await apolloClient.mutate({
      mutation: CLOSE_WINDOW,
    });
  };

  return (
    <View style={tw.style("flex-1")}>
      <View style={tw.style("flex-1 px-4 pb-4 pt-5")}>
        <Text
          style={tw.style("text-base font-semibold leading-6 text-gray-900")}
        >
          New Wallet
        </Text>

        <View>
          <Text
            style={tw.style("mt-2", "text-sm text-gray-500", "text-slate-700")}
          >
            {message}
          </Text>

          <View>
            <Text style={tw.style("font-medium text-md text-slate-700")}>
              {[
                "Postero will only store a copy of",
                "your wallet's private key, which you can export from the app after",
                "creation. We will not retain a copy of your mnemonic phrase.",
              ].join(" ")}
            </Text>
          </View>

          <View
            style={tw.style("self-center py-6", {
              width: 600,
            })}
          >
            <Text
              style={tw.style("mt-2", "text-sm", "text-slate-700", {
                userSelect: "text",
              })}
            >
              {mnemonic.map((row, index) => (
                <Text
                  key={index}
                  style={tw.style("py-1 flex flex-row justify-between")}
                >
                  {row.map((word, index) => (
                    <Text
                      key={index}
                      style={tw.style(
                        "border border-slate-500",
                        "p-1 mx-1 rounded text-center",
                        "font-medium",
                        {
                          minWidth: 90,
                        }
                      )}
                    >
                      {`${word}${index === 5 ? "\n" : ""}`}
                    </Text>
                  ))}
                </Text>
              ))}
            </Text>
          </View>
        </View>
      </View>
      <View style={tw.style("bg-gray-50 px-4 py-3", "flex-row justify-end")}>
        <Pressable
          style={tw.style(
            "inline-flex justify-center rounded-md",
            "bg-white px-3 py-2 text-sm font-semibold text-gray-900",
            "shadow-sm ring-1 ring-inset ring-gray-300",
            "hover:bg-gray-50 sm:mt-0 sm:w-auto",
            "ml-3"
          )}
          onPress={onCancel}
        >
          <Text>Cancel</Text>
        </Pressable>
        <Button style={tw.style("ml-3")} onPress={onCreate}>
          Create
        </Button>
      </View>
    </View>
  );
};

export default NewWalletWindow;
