import "../global.css";
import { SplashScreen, Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import ToastContainer from "@/components/ui/toast";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({ NotoSansKR: require("@/assets/fonts/NotoSansKR.ttf") });
  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return <View className="flex-1 bg-background" />;

  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor="#171717" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "#171717" } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="sign-in" />
        <Stack.Screen name="set-nickname" />
        <Stack.Screen name="set-preferences" />
      </Stack>
      <ToastContainer />
    </SafeAreaProvider>
  );
}
