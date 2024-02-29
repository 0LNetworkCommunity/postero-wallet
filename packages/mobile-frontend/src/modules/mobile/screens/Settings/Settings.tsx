import { FC } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

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

const Settings: FC = () => {
  const onNotif = async () => {
    const token = await registerForPushNotifications();
    console.log('token', token);
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <TouchableOpacity onPress={onNotif}>
        <Text>Notif</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Settings;
