import React, { useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import Text from "@/components/ui/text";
import SignInInput from "@/components/features/sign-in/sign-in-input";
import Button from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { useUserStore } from "@/lib/stores/user";
import { authUpdateUser } from "@/lib/apis/apis";
import { SITEMAP } from "@/data/sitemap";

const SetNicknamePage = () => {
  const params = useLocalSearchParams();
  const initialNickname = useUserStore.getState().user.nickname;
  const updateNickname = useUserStore((state) => state.setNickname);
  const [nickname, setNickname] = useState(initialNickname);
  const [errorMessage, setErrorMessage] = useState("");

  const handleConfirm = async () => {
    const { error } = await authUpdateUser({ nickname });
    if (!error) {
      updateNickname(nickname);
      const isCreated = params.isCreated;
      return isCreated ? router.replace(SITEMAP.SET_PREFERENCES) : router.replace(SITEMAP.MY_PAGE);
    }
    toast.serverError();
  };

  const handleInputChange = (text: string) => {
    if (errorMessage) setErrorMessage("");
    if (text.length <= 0) setErrorMessage("닉네임을 입력해주세요");
    if (text.length > 15) setErrorMessage("닉네임은 15자까지 입력할 수 있어요");
    setNickname(text);
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 flex-col px-[32px] py-[16px]">
        <Text className="mb-[80px] mt-[8px] text-center typography-small-title">닉네임 설정</Text>
        <View className="relative flex-1 w-full">
          <SignInInput placeholder="닉네임" value={nickname} onChangeText={handleInputChange} />
          {errorMessage && (
            <Text className="w-full pl-1 text-error typography-caption">{errorMessage}</Text>
          )}
          <Button
            onPress={handleConfirm}
            className="absolute bottom-[16px] left-0"
            disabled={!!errorMessage}
          >
            확인
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SetNicknamePage;
