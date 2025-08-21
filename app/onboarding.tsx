import React from "react";
import { View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import Text from "@/components/ui/text";
import Button from "@/components/ui/button";
import OnboardingCarousel from "@/components/features/onboarding/onboarding-carousel";
import { onboardingImages } from "@/data/onboarding";
import { authGuestLogin } from "@/lib/apis/apis";
import { useUserStore } from "@/lib/stores/user";
import { SITEMAP } from "@/data/sitemap";
import { SectionType } from "@/types/types";
import { toast } from "@/components/ui/toast";

const OnboardingPage = () => {
  const setUser = useUserStore((state) => state.setUser);

  const handleGuestSignIn = async () => {
    try {
      const { error, data } = await authGuestLogin();

      if (!error) {
        const preferences = data.sectionPreferences.reduce((acc, c) => {
          acc.set(c.sectionName, c.preference);
          return acc;
        }, new Map()) as unknown as Record<SectionType, number>;

        setUser({ user: data.user, preferences, ...data.tokens });
        router.push(`${SITEMAP.SET_NICKNAME}?isCreated=true`);
      } else toast.serverError();
    } catch (error) {
      console.error("Guest login error:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="relative flex-1 gap-14 flex-col justify-center pb-32">
        {/* 캐러셀 */}
        <View>
          <OnboardingCarousel gap={20}>
            {onboardingImages.map((image) => (
              <Image
                key={image.id}
                source={image.url}
                style={{ width: 200, height: 280, borderRadius: 8 }}
                resizeMode="cover"
              />
            ))}
          </OnboardingCarousel>
        </View>

        <Text className="typography-body1 !font-normal text-center">
          믿을 수 있는 쉽고 빠른 뉴스가{"\n"}
          이미 손 안에 도착했습니다
        </Text>

        {/* 버튼들 */}
        <View className="absolute bottom-0 left-0 right-0 px-8 pb-10 gap-4">
          <Button variant="default" onPress={() => router.push(SITEMAP.SIGN_IN)}>
            전화번호로 시작하기
          </Button>

          <Button variant="secondary" onPress={handleGuestSignIn}>
            게스트로 시작하기
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingPage;
