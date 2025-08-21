import "../global.css";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { useEffect, useState } from "react";
import * as Font from "expo-font";

export default function RootLayout() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadAppFonts = async () => {
      try {
        await Font.loadAsync({ NotoSansKR: require("@/assets/fonts/NotoSansKR.ttf") });
      } catch (error) {
        console.error("Font loading failed:", error);
      } finally {
        setFontsLoaded(true);
      }
    };

    loadAppFonts();
  }, []);

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: "#171717" }} />;
  }
  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor="#171717" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: "#171717",
            ...StyleSheet.create({
              text: {
                color: "#fafafa", // 기본 텍스트 색상
              },
            }).text,
          },
        }}
      >
        <Stack.Screen name="index" />
      </Stack>
    </SafeAreaProvider>
  );
}
