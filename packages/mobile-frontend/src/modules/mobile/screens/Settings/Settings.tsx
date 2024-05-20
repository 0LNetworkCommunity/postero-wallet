import { TouchableOpacity, Platform, SafeAreaView, StyleSheet } from "react-native";
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { gql, useApolloClient, useQuery } from "@apollo/client";
import tw from "twrnc";

import NavBar from "../../../ui/NavBar";
import { StackScreenProps } from "@react-navigation/stack";
import { ModalStackParams } from "../params";
import ChevronLeftIcon from "../../icons/ChevronLeftIcon";
import { Settings, SettingsKey } from "./types";
import SettingsControl from "./SettingsControl";
import { useEffect, useState } from "react";

const GET_SETTINGS = gql`
  query GetSettings {
    settings {
      rpcUrl,
      chainId,
      maxGasUnit,
      gasPricePerUnit
    }
  }
`;

const SET_SETTING = gql`
  mutation SetSettings($key: String!, $value: String!) {
    setSetting(key: $key, value: $value) {
      rpcUrl,
      chainId,
      maxGasUnit,
      gasPricePerUnit
    }
  }
`;

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

function SettingsView({
  route,
  navigation,
}: StackScreenProps<ModalStackParams, "Settings">) {
  const [settings, setSettings] = useState<Settings>();

  const apolloClient = useApolloClient();

  useEffect(() => {
    const load = async () => {
      const { data, error, loading } = await apolloClient.query<{
        settings: Settings;
      }>({
        query: GET_SETTINGS,
      });
      setSettings(data.settings);
    };
    load();
  }, []);

  const onNotif = async () => {
    const token = await registerForPushNotifications();
    console.log('token', token);
  };

  const onSettingChange = async (key: SettingsKey, value: string) => {
    const res = await apolloClient.mutate<{
      setSetting: Settings;
      }>({
      mutation: SET_SETTING,
      variables: {
        key,
        value,
      }
    });
    console.log(JSON.stringify(res, null, 2));
    if (res.data) {
      setSettings(res.data.setSetting);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavBar
        title="Settings"
        leftActions={
          <TouchableOpacity
            style={tw.style("p-2")}
            onPress={() => navigation.goBack()}
          >
            <ChevronLeftIcon color="#000000" />
          </TouchableOpacity>
        }
      />
      {settings && (
        <SettingsControl settings={settings} onChange={onSettingChange} />
      )}
    </SafeAreaView>
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

export default SettingsView;
