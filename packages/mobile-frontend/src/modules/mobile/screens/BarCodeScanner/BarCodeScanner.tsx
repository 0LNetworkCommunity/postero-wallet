import { FC, useEffect, useState } from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import { CameraView, Camera, BarcodeScanningResult } from "expo-camera/next";
import { StackScreenProps } from "@react-navigation/stack";
import tw from "twrnc";

import { ModalStackParams } from "../params";

const BarCodeScanner: FC<
  StackScreenProps<ModalStackParams, "BarCodeScanner">
> = ({ route, navigation }) => {
  const { onScan } = route.params;

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = (scanningResult: BarcodeScanningResult) => {
    if (scanned) {
      return;
    }
    onScan(scanningResult.data);
    navigation.pop();
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={tw.style("flex-1 items-center justify-center")}>
      <CameraView
        onBarcodeScanned={handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        style={{
          width: 256,
          height: 256,
        }}
      />
      {scanned && (
        <Button title={"Tap to Scan Again"} onPress={() => setScanned(false)} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
});

export default BarCodeScanner;
