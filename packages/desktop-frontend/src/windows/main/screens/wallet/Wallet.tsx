import { XMarkIcon } from "@heroicons/react/20/solid";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { BlurView } from "expo-blur";
import { FC } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import tw from 'twrnc';

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 1)",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    appRegion: "drag",
  },
  modalContainer: {
    width: 500,
    appRegion: "no-drag",
    backgroundColor: "white",
    padding: 40,
    borderRadius: 8,

    shadowColor: "rgb(0, 0, 0)",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
});

const Wallet: FC<{
  navigation: StackNavigationProp<any>;
  route: RouteProp<any, any>
}> = ({ route, navigation }) => {
  const { id } = route.params!;

  return (
    <BlurView intensity={15} tint="dark" style={styles.overlay}>
      <View
        style={tw.style(
          "relative transform",
          "overflow-hidden rounded-lg",
          "bg-white",
          "px-4 pb-4 pt-5",
          "shadow-xl",
          "transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6",
          {
            appRegion: "no-drag",
          }
        )}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View style={tw`right-0 top-0 pr-4 pt-4 sm:block`}>
            <View
              style={tw`rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
              <XMarkIcon style={tw`h-6 w-6`} aria-hidden="true" />
            </View>
          </View>
        </TouchableOpacity>
        <View style={tw`sm:flex sm:items-start`}>
          <View style={tw`mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left`}>
            <Text style={tw`text-base font-semibold leading-6 text-gray-900`}>
              Wallet {id}
            </Text>
            <View style={tw`mt-2`}>
              <Text style={tw`text-sm text-gray-500`}>
                Are you sure you want to deactivate your account? All of your
                data will be permanently removed from our servers forever. This
                action cannot be undone.
              </Text>
            </View>
          </View>
        </View>

        <View style={tw`mt-5 sm:mt-4 sm:flex sm:flex-row-reverse`}></View>

        <Button onPress={() => navigation.goBack()} title="Dismiss" />
      </View>
    </BlurView>
  );
};

export default Wallet;
