import React, { useState, useRef } from "react";
import { View } from "react-native";
import { Animated } from "react-native";
import Button from "@/components/ui/button";
import Hexagon from "@/components/ui/hexagon";
import { useUserStore } from "@/lib/stores/user";
import { sectionLabels } from "@/types/types";
import Text from "@/components/ui/text";

type SetPreferenceFinishPageProps = {
  onReSetup: () => void;
  onConfirm: () => void;
};

const SetPreferenceFinishPage = ({ onReSetup, onConfirm }: SetPreferenceFinishPageProps) => {
  const [withLabel, setWithLabel] = useState(true);
  const nickname = useUserStore((state) => state.user.nickname);
  const preferences = useUserStore((state) => state.preferences);
  const radii = sectionLabels.map((label) => preferences[label] * 30 || 30);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const handleReSetupClick = () => {
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
      onReSetup();
    });
  };

  return (
    <View className="flex-1 w-full overflow-hidden px-[32px] py-[16px]">
      <View className="relative flex-1 w-full pb-[80px]">
        <Animated.View className="pt-[24px]" style={{ opacity: opacityAnim }}>
          <Text className="typography-small-title !font-bold text-center">
            {nickname} 님의 {nickname.length > 6 && "\n"} 맞춤 설정이 완료되었어요!
          </Text>
          <Text className="typography-body1 text-center">좋아하실만한 뉴스를 준비할게요</Text>
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
        <View className="absolute bottom-[16px] left-0 w-full">
          <Text className="pb-5 typography-caption text-center">
            선호도는 마이페이지에서 언제든지 변경할 수 있어요
          </Text>
          <View className="flex-row w-full gap-2.5">
            <Button variant="secondary" className="flex-1" onPress={handleReSetupClick}>
              다시 설정하기
            </Button>
            <Button className="flex-1" onPress={onConfirm}>
              확인
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
};

export default SetPreferenceFinishPage;
