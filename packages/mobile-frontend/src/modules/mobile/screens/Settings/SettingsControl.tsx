import { useState } from "react";
import { View, Platform, StyleSheet } from "react-native";
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

import TextInput from "../../../ui/TextInput";
import { Settings, SettingsKey } from "./types";

const registerForPushNotifications = async (): Promise<string | null> => {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.warn('Failed to get push token for push notification!');
      return null;
    }
    const token = await Notifications.getDevicePushTokenAsync();
    console.log(token);

    return token.data as string;
  }
  return null;
}

interface Props {
  settings: Settings;
  onChange: (key: SettingsKey, value: string) => void;
}

function SettingsControl({ settings, onChange }: Props) {
  const [rpcUrl, setRpcUrl] = useState(settings.rpcUrl);
  const [gasPrice, setGasPrice] = useState(`${settings.gasPricePerUnit}`);
  const [maxGasUnit, setMaxGasUnit] = useState(`${settings.maxGasUnit}`);

  const onNotif = async () => {
    const token = await registerForPushNotifications();
    console.log('token', token);
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="RPC Endpoint"
        value={rpcUrl}
        onChangeText={setRpcUrl}
        hint="Chain id = 1"
        onBlur={() => {
          onChange(SettingsKey.RpcUrl, rpcUrl);
        }}
      />

      <View style={styles.separator} />

      <TextInput
        label="Default max gas unit"
        hint="Max gas unit to spend"
        value={maxGasUnit}
        onChangeText={setMaxGasUnit}
        onBlur={() => {
          onChange(SettingsKey.MaxGasUnit, maxGasUnit);
        }}
      />

      <View style={styles.separator} />

      <TextInput
        label="Default gas price"
        hint="Gas price per unit"
        value={gasPrice}
        onChangeText={setGasPrice}
        onBlur={() => {
          onChange(SettingsKey.GasPricePerUnit, gasPrice);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  separator: {
    width: "100%",
    height: 0.5,
    opacity: 0.4,
    backgroundColor: "#000000",
    marginVertical: 20,
  },
});

export default SettingsControl;
