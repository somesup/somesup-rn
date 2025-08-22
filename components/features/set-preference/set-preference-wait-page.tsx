import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { useUserStore } from "@/lib/stores/user";
import Text from "@/components/ui/text";
import LottieView from "lottie-react-native";

const comments = [
  (nickname: string) => `${nickname} 님을 위한\n뉴스를 수집하고 있어요`,
  () => "맞춤형 뉴스 피드를 구성하고 있어요",
  () => "거의 다 되었어요 !",
];

const SetPreferenceWaitPage = () => {
  const nickname = useUserStore((state) => state.user.nickname);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timeId = setInterval(() => {
      setIndex((prevIndex) => {
        if (prevIndex >= comments.length - 1) {
          clearInterval(timeId);
          return prevIndex;
        }
        return prevIndex + 1;
      });
    }, 2000);

    return () => clearInterval(timeId);
  }, []);

  return (
    <View className="relative flex-1 flex-col">
      <View className="absolute top-24 w-full">
        <Text className="text-center typography-small-title !font-bold">
          {comments[index](nickname)}
        </Text>
      </View>
      <View className="flex-1 items-center justify-center">
        <View className="w-full h-full items-center justify-center">
          <LottieView
            source={require("@/assets/animations/loading.json")}
            autoPlay
            loop
            style={{ width: 250, height: 250 }}
          />
        </View>
      </View>
    </View>
  );
};

export default SetPreferenceWaitPage;
