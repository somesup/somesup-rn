import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Text from "@/components/ui/text";
import SignInForm from "@/components/features/sign-in/sign-in-form";

const SignInPage = () => {
  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 flex-col px-8 py-4">
        <Text className="mb-20 mt-2 text-center typography-small-title">전화번호로 시작하기</Text>
        <SignInForm />
      </View>
    </SafeAreaView>
  );
};

export default SignInPage;
