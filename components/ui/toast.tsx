import React, { useEffect, useRef } from "react";
import { View, Animated, TouchableOpacity, Image } from "react-native";
import { router } from "expo-router";
import { useToastStore, Toast } from "@/lib/stores/toast";
import { SITEMAP } from "@/data/sitemap";
import Text from "@/components/ui/text";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import "react-native-get-random-values";
import uuid from "react-native-uuid";

const toastIcon: Record<Toast["type"], React.ReactNode> = {
  success: <MaterialIcons name="check-circle" size={24} color="#10B981" />,
  error: <MaterialIcons name="error" size={28} color="#FF7A7C" />,
  info: <MaterialIcons name="info" size={24} color="#3B82F6" />,
  promo: (
    <Image
      alt="news-paper.png"
      source={require("@/assets/images/news-paper.png")}
      style={{ width: 50, height: 50 }}
    />
  ),
  scrap: <Ionicons name="bookmark" size={20} color="#fafafa" />,
};

const ToastContainer = () => {
  const toasts = useToastStore((state) => state.toasts);

  return (
    <SafeAreaView className="absolute left-0 right-0 top-0 z-40">
      <View className="flex-col gap-2 p-4">
        {toasts.map((t) => (
          <ToastItem key={t.id} {...t} />
        ))}
      </View>
    </SafeAreaView>
  );
};

export default ToastContainer;

const ToastItem = ({ title, description, type, id }: Toast & { id: string }) => {
  const translateY = useRef(new Animated.Value(-50)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    const exitTimer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -50,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        useToastStore.getState().remove(id);
      });
    }, 3800);

    return () => {
      clearTimeout(exitTimer);
    };
  }, [type, id]);

  if (type === "promo") {
    return (
      <Animated.View
        style={{
          transform: [{ translateY }],
          opacity,
        }}
      >
        <TouchableOpacity
          onPress={() => router.push(SITEMAP.HIGHLIGHT)}
          className="relative flex w-full items-start gap-3 rounded-xl bg-white p-3"
        >
          <View className="flex-row gap-3 items-center">
            <View className="relative flex shrink-0 items-center">{toastIcon[type]}</View>
            <View className="flex-1">
              <Text className="typography-body1 text-gray-10">{title}</Text>
              <Text className="typography-body2 text-gray-10">{description}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      style={{
        transform: [{ translateY }],
        opacity,
      }}
      className={[
        "z-100 flex-row w-full items-center gap-5 rounded-lg bg-gray-20 px-4",
        type === "scrap" ? "h-[3.25rem]" : "h-[4rem]",
      ].join(" ")}
    >
      <View className="flex-row items-center gap-5">
        <View className="items-center justify-center">{toastIcon[type]}</View>
        <View className="flex-1">
          <Text className="typography-body3">{title}</Text>
          {description && <Text className="typography-caption2">{description}</Text>}
        </View>
      </View>
    </Animated.View>
  );
};

const createToast = (type: Toast["type"]) => (title: string, description?: string) => {
  const id = uuid.v4();
  useToastStore.getState().add({ type, title, description, id });
  setTimeout(() => useToastStore.getState().remove(id), 6000);
};

export const toast = {
  success: createToast("success"),
  info: createToast("info"),
  error: createToast("error"),
  promo: createToast("promo"),
  fiveNews: () =>
    createToast("promo")("5분만에 뉴스 훑기", "오늘이 지나기 전에, 오늘 뉴스 받아보세요!"),
  serverError: () =>
    createToast("error")("서버에 문제가 발생했습니다.", "잠시후 다시 시도해주세요"),
  scrap: () => createToast("scrap")("기사를 스크랩 목록에 담았어요 !"),
};
