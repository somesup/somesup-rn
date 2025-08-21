import React, { useState, useEffect, useRef, useCallback } from "react";
import { View } from "react-native";
import SignInInput from "./sign-in-input";
import Text from "@/components/ui/text";

type SignInInputCodeProps = {
  value: string;
  onChangeText: (text: string) => void;
  timerDuration?: number;
};

const SignInInputCode = ({ value, onChangeText, timerDuration = 300 }: SignInInputCodeProps) => {
  const [timeLeft, setTimeLeft] = useState(timerDuration);
  const intervalRef = useRef<number | null>(null);

  const startTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    setTimeLeft(timerDuration);
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [timerDuration]);

  useEffect(() => {
    startTimer();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [startTimer]);

  return (
    <View className="relative w-full">
      <View className="relative">
        <SignInInput placeholder="인증번호" value={value} onChangeText={onChangeText} />
        {timeLeft >= 0 && (
          <View className="absolute right-[16px] top-1/2 -translate-y-1/2">
            <Text className="typography-body2">{formatTime(timeLeft)}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default SignInInputCode;

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};
