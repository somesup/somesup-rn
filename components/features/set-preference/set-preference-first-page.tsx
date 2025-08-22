import React, { useState, useRef } from "react";
import { View } from "react-native";
import { Animated } from "react-native";
import Button from "@/components/ui/button";
import Hexagon from "@/components/ui/hexagon";
import { useUserStore } from "@/lib/stores/user";
import { sectionLabels } from "@/types/types";
import Text from "@/components/ui/text";

type SetPreferenceFirstPageProps = {
  onConfirm: () => void;
};

const SetPreferenceFirstPage = ({ onConfirm }: SetPreferenceFirstPageProps) => {
  const [withLabel, setWithLabel] = useState(true);
  const nickname = useUserStore((state) => state.user.nickname);
  const preferences = useUserStore((state) => state.preferences);
  const radii = sectionLabels.map((label) => preferences[label] * 30 || 30);

  const translateYAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const handleStartClick = () => {
    setWithLabel(false);

    Animated.parallel([
      Animated.timing(translateYAnim, {
        toValue: 160,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 2.8,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onConfirm();
    });
  };

  return (
    <View className="flex-1 w-full overflow-hidden px-[32px] py-[16px]">
      <View className="relative flex-1 w-full pb-[80px]">
        <Animated.View className="pt-[24px]" style={{ opacity: opacityAnim }}>
          <Text className="!font-bold typography-small-title text-center">{nickname} 님,</Text>
          <Text className="typography-body1 text-center">카테고리별 관심도를 알려주세요</Text>
        </Animated.View>
        <View className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pb-[40px] pt-[48px]">
          <Animated.View
            style={{
              transform: [{ translateY: translateYAnim }, { scale: scaleAnim }],
            }}
          >
            <Hexagon hexagons={[{ radii }]} withLabel={withLabel} />
          </Animated.View>
        </View>
      </View>
      <View className="relative w-full">
        <Button onPress={handleStartClick} className="absolute bottom-[16px]">
          시작하기
        </Button>
      </View>
    </View>
  );
};

export default SetPreferenceFirstPage;
