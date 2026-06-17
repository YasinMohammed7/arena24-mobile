import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "react-native-reanimated";
import "../global.css";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { useAuthStore } from "@/zustand/authStore";
import { useEffect } from "react";
import * as NavigationBar from "expo-navigation-bar";
import { AppState, Platform } from "react-native";
import "@/i18n/config";
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

  const configureNavigationBar = async () => {
    if (Platform.OS === "android") {
      // Hide the navigation bar completely
      await NavigationBar.setVisibilityAsync("hidden");
      await NavigationBar.setPositionAsync("absolute");
      await NavigationBar.setBackgroundColorAsync("transparent");
      await NavigationBar.setBehaviorAsync("overlay-swipe");
    }
  };

  // Initialize auth state and language from AsyncStorage when app starts
  useEffect(() => {
    initializeAuth();
    loadSavedLanguage();
  }, []); // Empty dependency array - only run once on mount

  useEffect(() => {
    // Configure navigation bar immediately
    configureNavigationBar();

    // // Re-apply configuration after a delay to handle hot reload
    const initialTimeout = setTimeout(() => configureNavigationBar(), 500);

    // AppState listener to re-configure navigation bar when app comes to foreground
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === "active") {
        // Re-apply navigation bar configuration when app becomes active
        setTimeout(() => configureNavigationBar(), 100);
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    // Cleanup
    return () => {
      clearTimeout(initialTimeout);
      subscription?.remove();
    };
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <GluestackUIProvider mode="light">
      <SafeAreaProvider>
        <ThemeProvider value={DefaultTheme}>
          {/* Edge-to-edge compatible StatusBar - only style matters */}
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
