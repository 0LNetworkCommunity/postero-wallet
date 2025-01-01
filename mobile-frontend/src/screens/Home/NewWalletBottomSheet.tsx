import {
  forwardRef,
  useMemo,
  useCallback,
  useImperativeHandle,
  useRef,
} from "react";
import { View, StyleSheet } from "react-native";
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { Button, ButtonSize, ButtonVariation, Text } from "@postero/ui";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface NewWalletBottomSheetHandle {
  open: () => void;
  close: () => void;
}

interface Props {}

export const NewWalletBottomSheet = forwardRef<NewWalletBottomSheetHandle, Props>(({}, ref) => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => [216 + 20 + insets.bottom], []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    []
  );

  useImperativeHandle(ref, () => {
    return {
      open() {
        bottomSheetRef.current?.expand();
      },
      close() {
        bottomSheetRef.current?.close();
      },
    };
  }, []);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      enablePanDownToClose
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
    >
      <BottomSheetView style={styles.contentContainer}>
        <View style={{ paddingBottom: 20 }}>
          <Text display xs bold>
            Create a new wallet
          </Text>
        </View>

        <View style={{ marginBottom: 8 }}>
          <Button
            size={ButtonSize.LG}
            variation={ButtonVariation.Secondary}
            title="Import seed phrase"
            onPress={() => {
              bottomSheetRef.current?.close();

              navigation.navigate("NewWallet", {
                screen: "MnemonicImport",
              });
            }}
          />
        </View>

        <View style={{ marginBottom: 8 }}>
          <Button
            size={ButtonSize.LG}
            variation={ButtonVariation.Secondary}
            title="Import private key"
            onPress={() => {
              bottomSheetRef.current?.close();

              navigation.navigate("NewWallet", {
                screen: "PrivateKeyImport",
              });
            }}
          />
        </View>

        <Button
          size={ButtonSize.XXL}
          variation={ButtonVariation.Primary}
          title="Create a new wallet"
          onPress={() => {
            bottomSheetRef.current?.close();
            navigation.navigate("NewWallet", {
              screen: "SafetyWarning",
            });
          }}
        />
      </BottomSheetView>
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
});
