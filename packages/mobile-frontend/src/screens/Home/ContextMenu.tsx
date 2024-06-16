import {
  forwardRef,
  useMemo,
  useCallback,
  useImperativeHandle,
  useRef,
} from "react";
import { StyleSheet } from "react-native";
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { Button } from "@postero/ui";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface ContextMenuHandle {
  open: () => void;
  close: () => void;
}

interface Props {}

const ContextMenu = forwardRef<ContextMenuHandle, Props>(({}, ref) => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => [200 + insets.bottom], []);

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
        <Button
          title="Private Keys"
          onPress={() => {
            bottomSheetRef.current?.close();
            navigation.navigate("PrivateKeys");
          }}
        />

        <Button
          title="Add Wallet"
          onPress={() => {
            bottomSheetRef.current?.close();
            navigation.navigate("NewWallet");
          }}
        />
      </BottomSheetView>
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "grey",
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
});

export default ContextMenu;
