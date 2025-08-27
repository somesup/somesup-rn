import React, { useEffect, useMemo, useState } from "react";
import {
  ImageBackground,
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import {
  FontAwesome,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import type { MyPageDto, SectionWithBehaviorDto } from "@/types/dto";
import { sectionLabels, SectionType } from "@/types/types";
import { getMyPageStats } from "@/lib/apis/apis";
import Hexagon from "@/components/ui/hexagon";
import WordCloudRN from "@/components/features/my-page/word-cloud";

export default function MyPageScreen() {
  const router = useRouter();
  const [data, setData] = useState<MyPageDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await getMyPageStats();
      if (res.error) {
        Alert.alert("오류", res.error.message);
      } else {
        setData(res.data);
      }
      setLoading(false);
    })();
  }, []);

  const sectionsMap = useMemo(() => {
    const acc = {} as Record<SectionType, SectionWithBehaviorDto>;
    (data?.sectionStats ?? []).forEach((s) => (acc[s.sectionName] = s));
    return acc;
  }, [data]);

  const preferenceRadii = sectionLabels.map(
    (label) => (sectionsMap[label]?.preference ?? 1) * 30
  );
  const behaviorRadii = sectionLabels.map(
    (label) => (sectionsMap[label]?.behaviorScore ?? 1) * 30
  );

  return (
    <SafeAreaView className="flex-1 text-[#FAFAFA] bg-[#1F1F1F]">
      <View className="pt-16 px-7 pb-8">
        <View className="flex-row items-center mb-2">
          {loading ? (
            <Text className="text-[#FAFAFA] typography-sub-title-bold mr-1">
              사용자
              <Text className="text-[#FAFAFA] typography-body1"> 님</Text>
            </Text>
          ) : (
            <Text className="text-[#FAFAFA] typography-sub-title-bold mr-1">
              {data?.user.nickname}
              <Text className="text-[#FAFAFA] typography-body1"> 님</Text>
            </Text>
          )}
          <Pressable onPress={() => router.push("/set-nickname")} hitSlop={8}>
            <MaterialCommunityIcons name="pencil" size={20} color="#FAFAFA" />
          </Pressable>
        </View>

        <Pressable
          className="mb-4 flex-row items-center justify-between rounded-xl bg-[#2E2E2E] p-3"
          onPress={() => router.push("/scrap-list")}
        >
          <View className="flex-row items-center">
            <FontAwesome name="bookmark" size={18} color="#FAFAFA" />
            <Text className="text-[#FAFAFA] ml-3 typography-body1">
              스크랩 목록
            </Text>
          </View>
          <MaterialIcons name="chevron-right" size={20} color="#FAFAFA" />
        </Pressable>

        <View className="mb-4">
          <Text className="mb-2 typography-body2 text-[#FAFAFA]">
            내가 읽은 뉴스
          </Text>

          <View className="items-center overflow-hidden rounded-xl bg-[#2E2E2E]">
            <View className="p-4">
              <Hexagon
                hexagons={[
                  {
                    radii: preferenceRadii,
                    fill: "#FF880060",
                    stroke: "#FF8800",
                  },
                  {
                    radii: behaviorRadii,
                    fill: "#AEFF8860",
                    stroke: "#AEFF88",
                  },
                ]}
                width={220}
                height={220}
              />
            </View>

            <View className="-mt-2 mb-3 flex-row">
              <View className="flex-row items-center">
                <FontAwesome name="square" size={12} color="#AEFF88" />
                <Text className="ml-2 typography-caption3 text-[#FAFAFA]">
                  읽은 뉴스
                </Text>
              </View>

              <View className="w-5" />

              <View className="flex-row items-center">
                <FontAwesome name="square" size={12} color="#FF8800" />
                <Text className="ml-2 typography-caption3 text-[#FAFAFA]">
                  선호도
                </Text>
              </View>
            </View>

            <Pressable
              className="w-full flex-row items-center justify-between border-t border-[#5D5D5D] px-3 py-3"
              onPress={() => router.push("/set-preferences")}
            >
              <Text className="typography-body2 text-[#FAFAFA]">
                관심 카테고리 수정
              </Text>
              <MaterialIcons name="chevron-right" size={20} color="#FAFAFA" />
            </Pressable>
          </View>
        </View>

        <View className="mb-8">
          <Text className="mb-2 typography-body2 text-[#FAFAFA]">
            자주 접한 키워드
          </Text>

          <View className="h-52 overflow-hidden rounded-xl bg-[#2E2E2E]">
            {loading ? (
              <View className="flex-1 items-center justify-center">
                <ActivityIndicator />
              </View>
            ) : data && data.keywordStats.length > 10 ? (
              <WordCloudRN items={data.keywordStats} height={188} />
            ) : (
              <View className="flex-1">
                <ImageBackground
                  source={require("@/assets/images/keyword-bg.png")}
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingHorizontal: 16,
                  }}
                  resizeMode="cover"
                  blurRadius={8}
                >
                  <Text className="text-center leading-5 text-[#FAFAFA]">
                    키워드 분석 준비 중입니다.{"\n"}더 많은 뉴스 시청 기록이
                    필요해요 !
                  </Text>
                </ImageBackground>
              </View>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
