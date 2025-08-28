import "../global.css";
import { SplashScreen, Stack, useRouter, useSegments, usePathname } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ToastContainer from "@/components/ui/toast";
import { clearExpiredTokens, getToken } from "@/lib/utils/token";
import { SITEMAP } from "@/data/sitemap";

SplashScreen.preventAutoHideAsync();

function AuthMiddleware() {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await clearExpiredTokens();

        const refreshToken = await getToken("refreshToken");

        const isOnboarding = segments[0] === "onboarding";
        const isSignIn = segments[0] === "sign-in";

        if (!refreshToken) {
          if (!isOnboarding && !isSignIn) router.replace(SITEMAP.ONBOARDING);
        } else {
          if (isOnboarding || isSignIn) router.replace(SITEMAP.HOME);
        }
      } catch (error) {
        console.error("토큰 검증 중 오류:", error);
        router.replace("/onboarding");
      }
    };

    checkAuth();
  }, [segments, router]);

  return null;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    NotoSansKR: require("@/assets/fonts/NotoSansKR.ttf"),
    NotoSansKR_Bold: require("@/assets/fonts/NotoSansKR-Bold.ttf"),
  });
  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return <View className="flex-1 bg-background" />;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="light" backgroundColor="#171717" />
        <AuthMiddleware />
        <ToastContainer />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "#171717" } }}>
          <Stack.Screen name="index" options={{ animation: "slide_from_bottom" }} />
          <Stack.Screen name="highlight" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="sign-in" />
          <Stack.Screen name="set-nickname" />
          <Stack.Screen name="set-preferences" />
          <Stack.Screen name="my-page" />
          <Stack.Screen name="scrap-list" />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
