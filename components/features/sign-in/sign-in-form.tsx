import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import Button from "@/components/ui/button";
import SignInInput from "./sign-in-input";
import SignInInputCode from "./sign-in-input-code";
import { authPhoneRequest, authPhoneVerify } from "@/lib/apis/apis";
import { SignInRequestDto } from "@/types/dto";
import { toast } from "@/components/ui/toast";
import { useUserStore } from "@/lib/stores/user";
import { MaterialIcons } from "@expo/vector-icons";
import { SectionType } from "@/types/types";
import { SITEMAP } from "@/data/sitemap";
import "react-native-get-random-values";
import uuid from "react-native-uuid";
import Text from "@/components/ui/text";

const SignInForm = () => {
  const [formValue, setFormValue] = useState<SignInRequestDto>({ phoneNumber: "", code: "" });
  const [step, setStep] = useState<keyof SignInRequestDto>("phoneNumber");
  const [errorMessage, setErrorMessage] = useState("");
  const [inputCodeKey, setInputCodeKey] = useState(uuid.v4() as string);
  const setUser = useUserStore((state) => state.setUser);

  const handlePhoneNumberInput = (text: string) => {
    if (errorMessage) setErrorMessage("");
    setFormValue((prev) => ({ ...prev, phoneNumber: text }));
    setTimeout(
      () => setFormValue((prev) => ({ ...prev, phoneNumber: formatPhoneNumber(text) })),
      20
    );
  };

  const handleVerificationCodeInput = (text: string) => {
    if (errorMessage) setErrorMessage("");
    setFormValue((prev) => ({ ...prev, code: text }));
  };

  const getConfirmDisable = () => {
    if (step === "phoneNumber") return isInvalidPhoneNumber(formValue.phoneNumber);
    return formValue.code === "";
  };

  const handleClickRequestCode = async () => {
    setInputCodeKey(uuid.v4() as string);
    setFormValue((prev) => ({ ...prev, code: "" }));
    const { error } = await authPhoneRequest(formValue);
    if (!error) setStep("code");
    else toast.serverError();
  };

  const handleClickSignIn = async () => {
    const { error, data } = await authPhoneVerify(formValue);
    if (!error) {
      const preferences = data.sectionPreferences.reduce((acc, c) => {
        acc.set(c.sectionName, c.preference);
        return acc;
      }, new Map()) as unknown as Record<SectionType, number>;

      setUser({ user: data.user, preferences });
      if (data.isCreated) return router.push(`${SITEMAP.SET_NICKNAME}?isCreated=true`);
      else return router.push(SITEMAP.HOME);
    }
    if (error.status === 401) return setErrorMessage("인증번호가 일치하지 않습니다");
    if (error.status === 404) return setErrorMessage("인증번호가 만료되었거나 존재하지 않습니다");
    toast.serverError();
  };

  const handleConfirm = () => {
    if (step === "phoneNumber") return handleClickRequestCode();
    else return handleClickSignIn();
  };

  return (
    <View className="relative flex-1 w-full flex-col items-end">
      <SignInInput
        placeholder="전화번호"
        value={formValue.phoneNumber}
        onChangeText={handlePhoneNumberInput}
        editable={step === "phoneNumber"}
        className="mb-2"
        keyboardType="phone-pad"
      />

      {step === "code" && (
        <SignInInputCode
          key={inputCodeKey}
          value={formValue.code}
          onChangeText={handleVerificationCodeInput}
        />
      )}

      {!errorMessage && step === "code" && (
        <TouchableOpacity
          onPress={handleClickRequestCode}
          className="mt-2 flex-row items-center gap-1"
        >
          <Text className="typography-caption">인증번호 재발송</Text>
          <MaterialIcons name="arrow-forward-ios" size={12} color="#fafafa" />
        </TouchableOpacity>
      )}

      {errorMessage && (
        <Text className="w-full pl-1 text-error typography-caption">{errorMessage}</Text>
      )}

      <Button onPress={handleConfirm} className="absolute bottom-4" disabled={getConfirmDisable()}>
        확인
      </Button>
    </View>
  );
};

export default SignInForm;

const isInvalidPhoneNumber = (phoneNumber: string): boolean => {
  const phoneNumberRegex = /^\d{3}-\d{3,4}-\d{4}$/;
  return !phoneNumberRegex.test(phoneNumber);
};

const formatPhoneNumber = (input: string): string => {
  const numbers = input.replace(/\D/g, "").substring(0, 11);
  return numbers
    .replace(/^(\d{3})(\d{4})(\d{4})/, "$1-$2-$3")
    .replace(/^(\d{3})(\d{3})(\d{1,4})/, "$1-$2-$3")
    .replace(/^(\d{3})(\d{1,3})$/, "$1-$2")
    .replace(/^(\d{3})$/, "$1");
};
