import { useCallback } from "react";
import { View } from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Storybook from "./.storybook";
import { fonts } from "./lib/theme";

SplashScreen.preventAutoHideAsync();

function App() {
  const [fontsLoaded, fontError] = useFonts({
    [fonts.primary[300]]: require("./assets/fonts/SpaceGrotesk-Light.otf"),
    [fonts.primary[400]]: require("./assets/fonts/SpaceGrotesk-Regular.otf"),
    [fonts.primary[500]]: require("./assets/fonts/SpaceGrotesk-Medium.otf"),
    [fonts.primary[700]]: require("./assets/fonts/SpaceGrotesk-Bold.otf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <Storybook />
      </View>
    </GestureHandlerRootView>
  );
}

export default App;
