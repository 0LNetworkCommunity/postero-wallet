import { forwardRef, useMemo, useCallback, useImperativeHandle, useRef } from 'react';
import { StyleSheet } from 'react-native';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { Button } from "@postero/ui";
import { useNavigation } from '@react-navigation/native';

export interface ContextMenuHandle {
  open: () => void;
  close: () => void;
}

interface Props {
  walletAddress: string;
}

const ContextMenu = forwardRef<ContextMenuHandle, Props>(({ walletAddress }, ref) => {
  const navigation = useNavigation<any>();

  const bottomSheetRef = useRef<BottomSheet>(null);
	const snapPoints = useMemo(() => ['20%'], []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

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

  const handleClosePress = () => bottomSheetRef.current?.close();

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
      onChange={handleSheetChanges}
      enablePanDownToClose
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
    >
      <BottomSheetView style={styles.contentContainer}>
        <Button
          title="Import from Mnemonic"
          onPress={() => {
            bottomSheetRef.current?.close();
            navigation.navigate("WalletPrivateKeys", {
              walletAddress,
            });
          }}
        />
        <Button
          title="Import Private Key"
          onPress={() => {
            bottomSheetRef.current?.close();
            navigation.navigate("WalletPrivateKeys", {
              walletAddress,
            });
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
    backgroundColor: 'grey',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
});

export default ContextMenu;
