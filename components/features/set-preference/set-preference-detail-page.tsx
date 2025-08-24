import React, { useState, useRef, useEffect, useCallback } from "react";
import { View, TouchableOpacity } from "react-native";
import { Animated } from "react-native";
import Button from "@/components/ui/button";
import Hexagon from "@/components/ui/hexagon";
import { useUserStore } from "@/lib/stores/user";
import { sectionLabels, sectionNames } from "@/types/types";
import SetPreferenceSlider from "./set-preference-slider";
import Text from "@/components/ui/text";

type SetPreferenceDetailPageProps = {
  onConfirm: () => void;
};

const SetPreferenceDetailPage = ({ onConfirm }: SetPreferenceDetailPageProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const preferences = useUserStore((state) => state.preferences);
  const setPreference = useUserStore((state) => state.setPreference);
  const [radii, setRadii] = useState(sectionLabels.map((label) => preferences[label] * 30 || 30));
  const [visited, setVisited] = useState(sectionLabels.map(() => false));
  const [slideValue, setSlideValue] = useState((radii[0] / 30 - 1) * 50);
  const [animation, setAnimation] = useState(false);

  const translateYAnim = useRef(new Animated.Value(160)).current;
  const scaleAnim = useRef(new Animated.Value(2.8)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const handleLabelClick = (index: number) => {
    const idx = index === -1 ? 0 : index;
    setAnimation(true);
    setPreference(sectionLabels[currentIndex], radii[currentIndex] / 30);
    setSlideValue((radii[idx] / 30 - 1) * 50);
    setVisited((v) => {
      const newVisited = [...v];
      newVisited[idx] = true;
      return newVisited;
    });

    Animated.timing(rotateAnim, {
      toValue: -idx * 60,
      duration: 600,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      setAnimation(false);
      setCurrentIndex(idx);
    }, 600);
  };

  const handleStartClick = () => {
    const notVisitedIndex = visited.findIndex((node) => node === false);
    handleLabelClick(notVisitedIndex);

    if (notVisitedIndex === -1) {
      Animated.parallel([
        Animated.timing(translateYAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: -359,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => onConfirm());
    }
  };

  const handleSlideValueChange = (value: number) => {
    setRadii((radii) => {
      const newRadii = [...radii];
      newRadii[currentIndex] = (value / 50) * 30 + 30;
      return newRadii;
    });
    setSlideValue(value);
  };

  return (
    <View className="flex-1 w-full overflow-hidden px-[32px] py-[16px]">
      <View className="relative flex-1 w-full flex-col pb-[80px]">
        <Animated.View className="text-center" style={{ opacity: opacityAnim }}>
          <Text className="typography-body1 text-center">카테고리별 관심도를 알려주세요</Text>
        </Animated.View>

        <View className="z-50 mb-5 mt-3 flex-row justify-center gap-2">
          {visited.map((v, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => handleLabelClick(idx)}
              className={`aspect-square w-1 rounded-full ${
                idx === currentIndex ? "bg-gray-60" : v ? "bg-[#4FE741]" : "bg-[#535353]"
              }`}
            />
          ))}
        </View>

        <View className="relative">
          <View
            className="absolute left-1/2 z-50 flex-row"
            style={{
              transform: [{ translateX: -26 }, { translateX: -currentIndex * 92 }],
            }}
          >
            {sectionNames.map((name, idx) => (
              <TouchableOpacity
                key={name}
                onPress={() => handleLabelClick(idx)}
                className="w-[56px]"
                style={{ marginRight: idx < sectionNames.length - 1 ? 36 : 0 }}
              >
                <Text
                  className={`typography-main-title  whitespace-nowrap
                    ${currentIndex !== idx && "!font-normal !text-gray-60/50"}`}
                >
                  {name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pb-[40px] pt-[48px]">
          <Animated.View
            className="absolute left-1/2 top-[44px] z-50 -translate-x-1/2"
            style={{ opacity: opacityAnim }}
          >
            <SetPreferenceSlider
              value={slideValue}
              onChange={handleSlideValueChange}
              shouldAnimation={animation}
              key={currentIndex}
            />
          </Animated.View>
          <View className="top-0 -z-10">
            <Animated.View
              style={{
                transform: [
                  { translateY: translateYAnim },
                  { scale: scaleAnim },
                  {
                    rotate: rotateAnim.interpolate({
                      inputRange: [-300, 0],
                      outputRange: ["-300deg", "0deg"],
                    }),
                  },
                ],
              }}
            >
              <Hexagon hexagons={[{ radii }]} withLabel={false} />
            </Animated.View>
          </View>
        </View>
      </View>

      <View className="relative w-full">
        <Button
          disabled={slideValue % 50 !== 0}
          className="absolute bottom-[16px] left-0"
          onPress={handleStartClick}
        >
          확인
        </Button>
      </View>
    </View>
  );
};

export default SetPreferenceDetailPage;
