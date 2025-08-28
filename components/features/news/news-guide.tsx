import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Dimensions } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { newsGuideData } from "@/data/news-guide";
import { useNewsGuideStore } from "@/lib/stores/news-guide";
import NewsAbstractView from "./news-abstract-view";
import NewsDetailView from "./news-detail-view";
import Text from "@/components/ui/text";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const { width: screenWidth } = Dimensions.get("window");

const NewsGuide = () => {
  const [step, setStep] = useState(1);

  if (step === 3) return null;

  return (
    <View className="absolute inset-0 z-10">
      {step === 1 && <FirstPage onNext={() => setStep(2)} />}
      {step === 2 && <SecondPage onNext={() => setStep(3)} />}
    </View>
  );
};

export default NewsGuide;

const FirstPage = ({ onNext }: { onNext: () => void }) => {
  const yScroll = useSharedValue(0);

  useEffect(() => {
    yScroll.value = withRepeat(withTiming(100, { duration: 700 }), -1, true);
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: -yScroll.value }],
    };
  });

  return (
    <>
      <View className="absolute inset-0 -z-10 h-full w-full">
        <Animated.View className="absolute inset-0" style={animatedStyle}>
          {newsGuideData.map((item) => (
            <NewsAbstractView key={item.id} {...item} />
          ))}
        </Animated.View>
      </View>
      <View className="absolute inset-0 -z-10 bg-gray-10/60" />
      <View className="z-10 flex h-full flex-col items-center justify-center gap-10">
        <MaterialIcons name="keyboard-arrow-up" size={80} color="#fafafa" />

        <Text className="text-center !leading-10 typography-main-title">
          위/아래 스와이프로 {"\n"}
          이전/다음 기사를 볼 수 있습니다!
        </Text>
        <MaterialIcons name="keyboard-arrow-down" size={80} color="#fafafa" />
        <TouchableOpacity
          onPress={onNext}
          className="absolute bottom-10 right-10 w-fit rounded-lg bg-gray-60 px-4 py-2"
        >
          <Text className="font-semibold text-gray-10">다음</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const SecondPage = ({ onNext }: { onNext: () => void }) => {
  const article = newsGuideData[0];
  const xTransform = useSharedValue(screenWidth);
  const setViewed = useNewsGuideStore((state) => state.setViewed);

  useEffect(() => {
    xTransform.value = withRepeat(withTiming(screenWidth - 100, { duration: 700 }), -1, true);
  }, []);

  const detailAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: xTransform.value }],
    };
  });

  return (
    <>
      <View className="absolute inset-0 -z-10 h-full w-full">
        <View className="absolute inset-0">
          <NewsAbstractView {...article} />
          <Animated.View className="absolute inset-0" style={detailAnimatedStyle}>
            <NewsDetailView fullSummary={article.fullSummary} />
          </Animated.View>
        </View>
      </View>
      <View className="absolute inset-0 -z-10 bg-gray-10/60" />
      <View className="flex h-full flex-col items-center justify-center gap-10">
        <View className="flex flex-row items-center gap-5">
          <MaterialIcons name="keyboard-arrow-left" size={80} color="#fafafa" />
          <Text className="text-center !leading-10 typography-main-title">/</Text>
          <MaterialIcons name="keyboard-arrow-right" size={80} color="#fafafa" />
        </View>
        <Text className="text-center !leading-10 typography-main-title">
          오른쪽 스와이프로 {"\n"}
          자세한 기사를 볼 수 있습니다!
        </Text>
        <TouchableOpacity
          onPress={() => {
            onNext();
            setViewed();
          }}
          className="absolute bottom-10 right-10 w-fit rounded-lg bg-gray-60 px-4 py-2"
        >
          <Text className="text-gray-10">확인</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};
