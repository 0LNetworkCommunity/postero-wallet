import { useCallback } from 'react';
import { View } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Storybook from "./.storybook";

SplashScreen.preventAutoHideAsync();

function App() {
  const [fontsLoaded, fontError] = useFonts({
    'SpaceGrotesk-Bold': require('./assets/fonts/SpaceGrotesk-Bold.otf'),
    'SpaceGrotesk-Light': require('./assets/fonts/SpaceGrotesk-Light.otf'),
    'SpaceGrotesk-Medium': require('./assets/fonts/SpaceGrotesk-Medium.otf'),
    'SpaceGrotesk-Regular': require('./assets/fonts/SpaceGrotesk-Regular.otf'),
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
