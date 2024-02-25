import { gql, useApolloClient } from "@apollo/client";
import { FC, useState } from "react";
import { View, Text, StyleSheet, Pressable, TextInput } from "react-native";
import tw from "twrnc";

const IMPORT_WALLET = gql`
  mutation ImportWallet($mnemonic: String!) {
    importWallet(mnemonic: $mnemonic)
  }
`;

const CLOSE_WINDOW = gql`
  mutation CloseWindow {
    closeWindow
  }
`;

const ImportWalletWindow: FC = () => {
  const apolloClient = useApolloClient();
  const [mnemonic, setMnemonic] = useState('');

  const onCancel = async () => {
    await apolloClient.mutate({
      mutation: CLOSE_WINDOW,
    });
  };

  const onImport = async () => {
    await apolloClient.mutate({
      mutation: IMPORT_WALLET,
      variables: {
        mnemonic,
      }
    });
    await apolloClient.mutate({
      mutation: CLOSE_WINDOW,
    });
  };

  return (
    <View
      style={tw.style(
        {
          appRegion: "drag",
        },
        { width: "100%", height: "100%" }
      )}
    >
      <View style={tw.style("flex-1 justify-center items-center")}>
        <Text>Import Wallet</Text>
        <TextInput
          style={{
            borderColor: "#000000",
            borderWidth: 1,
            borderStyle: "solid",
          }}
          value={mnemonic}
          onChangeText={setMnemonic}
          secureTextEntry
          onSubmitEditing={onImport}
        />
      </View>

      <View
        style={tw.style("px-5 items-center flex-row", {
          height: 59,
          borderColor: "rgba(0,0,0,0.10)", // opacity: 0.5;
          borderWidth: 1,
          borderStyle: "solid",
        })}
      >
        <View style={tw.style("flex-1")} />
        <View style={tw.style("flex-row")}>
          <Pressable onPress={onCancel}>
            <View
              style={tw.style("py-0.5 px-3", {
                background: "#FFFFFF",
                border: "1px solid rgba(0,0,0,0.02)",
                boxShadow:
                  "0 0.25px 0.25px 0 rgba(0,0,0,0.15), 0 1px 0.75px 0 rgba(0,0,0,0.05)",
                borderRadius: 5,
              })}
            >
              <Text>Cancel</Text>
            </View>
          </Pressable>
          <View style={tw.style("w-4")} />
          <Pressable onPress={onImport}>
            <View
              style={tw.style("py-0.5 px-3", {
                backgroundColor: "#007AFF",
                borderRadius: 5,
              })}
            >
              <View
                style={[
                  StyleSheet.absoluteFill,
                  tw.style({
                    // background: "#FFFFFF",
                    // border: "1px solid rgba(0,0,0,0.02)",
                    // boxShadow:
                    //   "0 0.25px 0.25px 0 rgba(0,0,0,0.15), 0 1px 0.75px 0 rgba(0,0,0,0.05)",

                    background: "#007AFF",
                    boxShadow:
                      "0 0 3px 0 rgba(255,255,255,0.12), 0 1px 2px 0 rgba(255,255,255,0.12), 0 0 1px 0 rgba(255,255,255,0.24)",
                    opacity: 0.17,
                    backgroundImage:
                      "linear-gradient(179deg, #FFFFFF 0%, rgba(255,255,255,0.00) 96%)",
                  }),
                ]}
              />
              <Text style={{ color: "#ffffff" }}>Import</Text>
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default ImportWalletWindow;
