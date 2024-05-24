import { useState } from "react";
import { View } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import * as Clipboard from 'expo-clipboard';

import Text from "../Text";
import { Button, ButtonSize, ButtonVariation } from "../Button";
import { Copy03Icon } from "../../icons/Copy03Icon";
import { EyeIcon } from "../../icons/EyeIcon";
import { EyeOffIcon } from "../../icons/EyeOffIcon";

interface Props {
  mnemonic: string;
}

export function Mnemonic({ mnemonic }: Props) {
  const [hidden, setHidden] = useState(true);
  const words = mnemonic.split(' ');
  const colSize = Math.floor(words.length / 2);
  const colCount = Math.ceil(words.length / colSize);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
        <TouchableOpacity
          onPress={() => {
            setHidden((value) => !value);
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {hidden ? (
              <>
                <EyeIcon size={20} color="#B7353B" />
                <Text
                  text
                  sm
                  medium
                  style={{ marginLeft: 6, color: "#B7353B" }}
                >
                  Show phrase
                </Text>
              </>
            ) : (
              <>
                <EyeOffIcon size={20} color="#B7353B" />
                <Text
                  text
                  sm
                  medium
                  style={{ marginLeft: 6, color: "#B7353B" }}
                >
                  Hide phrase
                </Text>
              </>
            )}
          </View>
        </TouchableOpacity>
      </View>
      {hidden ? (
        <View style={{ flex: 1 }}>
          <View
            style={{
              marginHorizontal: 16,
              borderRadius: 6,
              backgroundColor: "#F5F5F5",
              alignItems: "center",
              paddingVertical: 66,
              paddingHorizontal: 20,
            }}
          >
            <EyeIcon size={20} color="#141414" />
            <Text text md regular style={{ marginTop: 9 }}>
              Don’t let anybody else see this.
            </Text>
          </View>
        </View>
      ) : (
        <ScrollView style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", paddingHorizontal: 8 }}>
            {new Array(colCount).fill(0).map((_, colIndex) => {
              const colWords = words.slice(
                colIndex * colSize,
                colIndex * colSize + colSize
              );

              return (
                <View
                  key={colIndex}
                  style={{ paddingHorizontal: 8, flexGrow: 1 }}
                >
                  <View>
                    {colWords.map((word, index) => {
                      return (
                        <View key={index} style={{ paddingVertical: 4 }}>
                          <Text>
                            <Text
                              text
                              md
                              regular
                              quarterary
                            >{`${index + colIndex * colSize + 1}. `}</Text>
                            <Text text md regular>
                              {word}
                            </Text>
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
      )}
      <View style={{ paddingHorizontal: 16 }}>
        <Button
          size={ButtonSize.MD}
          variation={ButtonVariation.Secondary}
          title="Copy to clipboard"
          onPress={() => {
            Clipboard.setStringAsync(mnemonic);
          }}
          icon={Copy03Icon}
          style={{ marginTop: 20 }}
        />
      </View>
    </View>
  );
}
