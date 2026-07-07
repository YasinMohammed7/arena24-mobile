import { DefaultTheme, ThemeProvider } from "expo-router/react-navigation";
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "react-native-reanimated";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { useAuthStore } from "@/zustand/authStore";
import { useEffect } from "react";
import { NavigationBar } from "expo-navigation-bar";
import { loadSavedLanguage } from "@/i18n/config";

export default function RootLayout() {
  // const colorScheme = useColorScheme();
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  const [loaded] = useFonts({
    "poppins-regular": require("../assets/fonts/Poppins/Poppins-Regular.ttf"),
    "poppins-bold": require("../assets/fonts/Poppins/Poppins-Bold.ttf"),
    "poppins-semibold": require("../assets/fonts/Poppins/Poppins-SemiBold.ttf"),
    "poppins-medium": require("../assets/fonts/Poppins/Poppins-Medium.ttf"),
    "poppins-light": require("../assets/fonts/Poppins/Poppins-Light.ttf"),
    "poppins-extralight": require("../assets/fonts/Poppins/Poppins-ExtraLight.ttf"),
    "poppins-black": require("../assets/fonts/Poppins/Poppins-Black.ttf"),
    "hotel-resort": require("../assets/fonts/hotelResort.otf"),
  });

  // Initialize auth state and language from AsyncStorage when app starts
  useEffect(() => {
    initializeAuth();
    loadSavedLanguage();
  }, [initializeAuth]);

  if (!loaded) {
    return null;
  }

  return (
    <GluestackUIProvider mode="light">
      <SafeAreaProvider>
        <ThemeProvider value={DefaultTheme}>
          {/* Edge-to-edge compatible StatusBar - only style matters */}
          <NavigationBar hidden />
          <KeyboardProvider>
            <StatusBar style="dark" />
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(navigationBar)" />
              <Stack.Screen name="+not-found" />
            </Stack>
          </KeyboardProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GluestackUIProvider>
  );
}
