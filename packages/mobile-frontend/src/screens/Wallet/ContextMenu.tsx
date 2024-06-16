import { forwardRef, useMemo, useCallback, useImperativeHandle, useRef } from 'react';
import { Alert, StyleSheet } from 'react-native';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { Button } from "@postero/ui";
import { useNavigation } from '@react-navigation/native';
import { gql, useApolloClient } from '@apollo/client';

const SET_SLOW = gql`
  mutation SetSlow($walletAddress: Bytes!) {
    setSlow(walletAddress: $walletAddress)
  }
`;

export interface ContextMenuHandle {
  open: () => void;
  close: () => void;
}

interface Props {
  walletAddress: string;
}

const ContextMenu = forwardRef<ContextMenuHandle, Props>(({ walletAddress }, ref) => {
  const navigation = useNavigation<any>();
  const apolloClient = useApolloClient();

  const bottomSheetRef = useRef<BottomSheet>(null);
	const snapPoints = useMemo(() => [250], []);

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

  const onSetSlow = () => {
    Alert.alert("Set slow", "Are you sure?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "OK",
        onPress: async () => {
          try {
            const res = await apolloClient.mutate({
              mutation: SET_SLOW,
              variables: {
                walletAddress,
              },
            });
          } catch (error) {
            console.error(error);
          }
        },
      },
    ]);
  };

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
          title="Set slow"
          onPress={() => {
            onSetSlow();
            bottomSheetRef.current?.close();
          }}
        />

        <Button
          title="Rotate key"
          onPress={() => {
            bottomSheetRef.current?.close();
            navigation.navigate("KeyRotation", {
              screen: "Splash",
              params: {
                address: walletAddress,
              },
            });
          }}
        />

        <Button
          title="Private Keys"
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
    padding: 20,
  },
});

export default ContextMenu;
