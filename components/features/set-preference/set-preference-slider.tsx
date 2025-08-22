import React, { useRef, useState, useEffect, useCallback } from "react";
import { View, PanResponder } from "react-native";
import { Animated } from "react-native";
import Text from "@/components/ui/text";

type SetPreferenceSliderProps = {
  value: number;
  shouldAnimation: boolean;
  onChange: (value: number, isDragging: boolean) => void;
};

const SetPreferenceSlider = ({ value, onChange, shouldAnimation }: SetPreferenceSliderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayValue, setDisplayValue] = useState(value);
  const animatedValue = useRef(new Animated.Value(value)).current;
  const sliderRef = useRef<View>(null);
  const sliderLayoutRef = useRef({ y: 0, height: 0 });

  const snapDelay = 50;
  const snapValues = [0, 50, 100];

  const findNearestSnapValue = useCallback(
    (currentValue: number) => {
      return snapValues.reduce((nearest, snapValue) => {
        return Math.abs(currentValue - snapValue) < Math.abs(currentValue - nearest)
          ? snapValue
          : nearest;
      });
    },
    [snapValues]
  );

  const animateToSnapValue = (targetValue: number) => {
    if (targetValue === displayValue) return;

    setIsAnimating(true);

    Animated.timing(animatedValue, {
      toValue: targetValue,
      duration: 200,
      useNativeDriver: false,
    }).start(() => {
      setIsAnimating(false);
    });

    setDisplayValue(targetValue);
    onChange(targetValue, false);
  };

  const debouncedSnap = (currentValue: number) => {
    if (!isDragging && !isAnimating && !shouldAnimation) {
      const nearestSnap = findNearestSnapValue(currentValue);
      if (nearestSnap !== currentValue)
        setTimeout(() => animateToSnapValue(nearestSnap), snapDelay);
    }
  };

  useEffect(() => {
    if (!isDragging && !isAnimating) {
      if (shouldAnimation) {
        Animated.timing(animatedValue, {
          toValue: value,
          duration: 600,
          useNativeDriver: false,
        }).start();
        setDisplayValue(value);
      } else {
        setDisplayValue(value);
        animatedValue.setValue(value);
      }
    }
  }, [value, isDragging, isAnimating, animatedValue, shouldAnimation]);

  useEffect(() => {
    if (!isDragging && !isAnimating && !shouldAnimation) debouncedSnap(displayValue);
  }, [isDragging, isAnimating, displayValue, debouncedSnap, shouldAnimation]);

  const updateValue = (pageY: number) => {
    const currentLayout = sliderLayoutRef.current;
    if (isAnimating || currentLayout.height === 0) return;

    sliderRef.current?.measure((x, y, width, height, pageX, absoluteY) => {
      const relativeY = pageY - absoluteY;

      const newValue = Math.max(0, Math.min(1, 1 - relativeY / height)) * 100;
      const roundedValue = Math.round(newValue);

      setDisplayValue(roundedValue);
      animatedValue.setValue(roundedValue);
      onChange(roundedValue, true);
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        if (isAnimating) return;
        setIsDragging(true);
        updateValue(evt.nativeEvent.pageY);
      },
      onPanResponderMove: (evt) => {
        updateValue(evt.nativeEvent.pageY);
      },
      onPanResponderRelease: () => {
        setIsDragging(false);
        // 드래그가 끝나면 스냅 애니메이션 실행
        setTimeout(() => {
          debouncedSnap(displayValue);
        }, 10);
      },
    })
  ).current;

  const onLayout = (event: any) => {
    const { y, height } = event.nativeEvent.layout;
    sliderLayoutRef.current = { y, height };
  };

  return (
    <View className="flex-row items-center">
      <View
        ref={sliderRef}
        {...panResponder.panHandlers}
        onLayout={onLayout}
        className="relative mx-auto h-[212px] w-[12px] rounded-full bg-[#535353]"
      >
        <Animated.View
          className={`absolute bottom-0 w-full rounded-full bg-white`}
          style={{
            height: animatedValue.interpolate({
              inputRange: [0, 100],
              outputRange: ["0%", "100%"],
            }),
          }}
        />
        <Animated.View
          className={`absolute left-1/2 flex h-[48px] w-[24px] -translate-x-1/2 transform flex-col items-center justify-center gap-[4px] rounded-full bg-white shadow-lg`}
          style={{
            bottom: animatedValue.interpolate({
              inputRange: [0, 100],
              outputRange: ["0%", "100%"],
            }),
            marginBottom: -24,
          }}
        >
          <View className="h-0 w-[12px] border-2 border-[#ececec]" />
          <View className="h-0 w-[12px] border-2 border-[#ececec]" />
          <View className="h-0 w-[12px] border-2 border-[#ececec]" />
        </Animated.View>
      </View>

      <View className="absolute left-[200%] top-1/2 flex h-[240px] -translate-y-1/2 flex-col items-center justify-between">
        <Text className="typography-caption whitespace-nowrap">높음</Text>
        <Text className="typography-caption whitespace-nowrap">중간</Text>
        <Text className="typography-caption whitespace-nowrap">낮음</Text>
      </View>
    </View>
  );
};

export default SetPreferenceSlider;
