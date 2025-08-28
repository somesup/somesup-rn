import React, { useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import Text from "@/components/ui/text";
import SetPreferenceFirstPage from "@/components/features/set-preference/set-preference-first-page";
import SetPreferenceDetailPage from "@/components/features/set-preference/set-preference-detail-page";
import SetPreferenceFinishPage from "@/components/features/set-preference/set-preference-finish-page";
import { useUserStore } from "@/lib/stores/user";
import { sectionLabels, sectionMappingId } from "@/types/types";
import { UpdatePreferencesRequestDto } from "@/types/dto";
import { authUpdatePreferences } from "@/lib/apis/apis";
import { toast } from "@/components/ui/toast";
import { SITEMAP } from "@/data/sitemap";
import SetPreferenceWaitPage from "@/components/features/set-preference/set-preference-wait-page";

const SetPreferencesPage = () => {
  const [step, setStep] = useState<"first" | "detail" | "finish" | "wait">("first");

  const handlePreferenceDone = async () => {
    setStep("wait");

    const preferences = useUserStore.getState().preferences;
    const request = sectionLabels.reduce((acc, label) => {
      acc.push({ sectionId: sectionMappingId[label], preference: preferences[label] });
      return acc;
    }, [] as UpdatePreferencesRequestDto);

    const { error } = await authUpdatePreferences(request);
    if (!error) return router.replace(SITEMAP.HOME);
    toast.serverError();
  };

  return (
    <SafeAreaView className="flex-1">
      {step !== "wait" && (
        <View className="px-8 pt-6">
          <View className="relative">
            <Text className="text-center typography-small-title">맞춤 설정</Text>
          </View>
        </View>
      )}
      {step === "first" && <SetPreferenceFirstPage onConfirm={() => setStep("detail")} />}
      {step === "detail" && <SetPreferenceDetailPage onConfirm={() => setStep("finish")} />}
      {step === "finish" && (
        <SetPreferenceFinishPage
          onReSetup={() => setStep("detail")}
          onConfirm={handlePreferenceDone}
        />
      )}
      {step === "wait" && <SetPreferenceWaitPage />}
    </SafeAreaView>
  );
};

export default SetPreferencesPage;
