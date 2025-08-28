import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  Animated,
  Easing,
  StyleSheet,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter, usePathname } from "expo-router";
import { useHighlightStore } from "@/lib/stores/highlight";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Page = { href: string; label: string };

const pages: Page[] = [
  { href: "/", label: "Some's up" },
  { href: "/highlight", label: "5분 뉴스" },
  { href: "/my-page", label: "마이페이지" },
];

export default function PageSelector({ style }: { style?: any }) {
  console.log("PageSelector rendered");
  const router = useRouter();
  const pathname = usePathname();
  const isVisited = useHighlightStore((s) => s.isVisited);

  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  const insets = useSafeAreaInsets();

  const currentPage = useMemo(() => pages.find((p) => p.href === pathname) ?? pages[0], [pathname]);
  const otherPages = useMemo(
    () => pages.filter((p) => p.href !== currentPage.href),
    [currentPage.href]
  );

  useEffect(() => setMounted(true), []);
  const shouldShowIndicator = mounted && !isVisited();

  const progress = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      Animated.timing(progress, {
        toValue: 1,
        duration: 150,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(progress, {
        toValue: 0,
        duration: 150,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start(({ finished }) => finished && setIsVisible(false));
    }
  }, [isOpen, progress]);

  const scale = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.98, 1],
  });
  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-8, 0],
  });
  const opacity = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const handleClose = () => setIsOpen(false);
  const handleNavigate = (href: string) => {
    setIsOpen(false);
    router.push(href as any);
  };

  return (
    <>
      {isVisible && (
        <Pressable
          onPress={handleClose}
          style={StyleSheet.absoluteFill}
          className="z-40 bg-black/50"
        />
      )}

      <View
        className="absolute w-full"
        style={[
          { alignItems: "center", top: insets.top + 10, zIndex: 1000, elevation: 1000 },
          style,
        ]}
      >
        <View style={{ position: "relative" }}>
          <TouchableOpacity
            onPress={() => setIsOpen((o) => !o)}
            accessibilityRole="button"
            accessibilityState={{ expanded: isOpen }}
            activeOpacity={0.8}
            className="relative flex-row items-center"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            {!isOpen && shouldShowIndicator && (
              <FontAwesome
                name="circle"
                size={8}
                color="#FF3F62"
                style={{
                  position: "absolute",
                  left: -14,
                  top: "50%",
                  marginTop: -4,
                }}
              />
            )}
            <Text className="typography-small-title" style={{ color: "#FAFAFA" }}>
              {currentPage.label}
            </Text>
            <View
              style={{
                position: "absolute",
                right: -24,
                top: "50%",
                transform: [{ translateY: -11 }],
              }}
            >
              <MaterialIcons
                name={isOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                size={22}
                color="#FAFAFA"
              />
            </View>
          </TouchableOpacity>
          {isVisible && (
            <Animated.View
              style={{
                position: "absolute",
                top: 36,
                left: 0,
                right: 0,
                alignItems: "center",
                transform: [{ translateY }, { scale }],
                opacity,
              }}
              pointerEvents={isOpen ? "auto" : "none"}
            >
              <View style={{ alignItems: "center" }}>
                {otherPages.map(({ href, label }) => (
                  <TouchableOpacity
                    key={href}
                    onPress={() => handleNavigate(href)}
                    activeOpacity={0.75}
                    style={{
                      paddingVertical: 6,
                      marginVertical: 6,
                      minWidth: 140,
                    }}
                  >
                    <View style={{ position: "relative", alignItems: "center" }}>
                      {label === "5분 뉴스" && shouldShowIndicator && (
                        <FontAwesome
                          name="circle"
                          size={8}
                          color="#FF3F62"
                          style={{
                            position: "absolute",
                            left: 26,
                            top: "50%",
                            marginTop: -4,
                          }}
                        />
                      )}
                      <Text className="typography-small-title" style={{ color: "#FAFAFA" }}>
                        {label}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </Animated.View>
          )}
        </View>
      </View>
    </>
  );
}
