import { useEffect, useState } from "react";
import { Dimensions } from "react-native";
import {
  Gesture,
  GestureUpdateEvent,
  PanGestureHandlerEventPayload,
} from "react-native-gesture-handler";
import { runOnJS, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

const SPRING_CONFIG = { damping: 25, stiffness: 200 };
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

type useSwipeGesturesProp = {
  itemsLength: number;
  onItemChange?: (index: number) => void;
  onDetailToggle?: (index: number, isDetail: boolean) => void;
  onEndReached?: () => void;
};

const useSwipeGestures = ({
  itemsLength,
  onItemChange,
  onDetailToggle,
  onEndReached,
}: useSwipeGesturesProp) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const translateY = useSharedValue(0);
  const translateX = useSharedValue(screenWidth);
  const isDragging = useSharedValue(false);

  const animatedStyle = useAnimatedStyle(() => {
    return { transform: [{ translateY: translateY.value }] };
  });

  const detailAnimatedStyle = useAnimatedStyle(() => {
    return { transform: [{ translateX: translateX.value }] };
  });

  const handleUpdate = (event: GestureUpdateEvent<PanGestureHandlerEventPayload>) => {
    const { translationX, translationY } = event;

    // 상세 뷰가 열려있을 때는 수직 제스처 무시
    if (isDetailOpen) {
      if (Math.abs(translationX) > Math.abs(translationY)) {
        // 수평 제스처만 처리
        if (translationX > 0) {
          // 오른쪽 스와이프 (상세 뷰 닫기)
          const progress = Math.min(translationX / 200, 1);
          translateX.value = progress * screenWidth;
        }
      }
    } else {
      // 상세 뷰가 닫혀있을 때
      if (Math.abs(translationY) > Math.abs(translationX) * 1.5) {
        // 수직 제스처
        const newY = -currentIndex * screenHeight + translationY;
        translateY.value = newY;
      } else if (translationX < 0 && Math.abs(translationX) > Math.abs(translationY)) {
        // 왼쪽 스와이프 (상세 뷰 열기)
        const progress = Math.min(Math.abs(translationX) / 200, 1);
        translateX.value = screenWidth - progress * screenWidth;
      }
    }
  };

  const gesture = Gesture.Pan()
    .onStart(() => (isDragging.value = true))
    .onUpdate(handleUpdate)
    .onEnd((event) => {
      const { translationX, translationY, velocityX, velocityY } = event;
      isDragging.value = false;

      if (isDetailOpen) {
        // 상세 뷰가 열려있을 때
        if (translationX > 100 || velocityX > 500) {
          // 오른쪽으로 충분히 스와이프하면 닫기
          runOnJS(setIsDetailOpen)(false);
          translateX.value = withSpring(screenWidth, SPRING_CONFIG);
        } else {
          // 원래 위치로 복귀
          translateX.value = withSpring(0, SPRING_CONFIG);
        }
      } else {
        // 상세 뷰가 닫혀있을 때
        if (Math.abs(translationY) > 100 || Math.abs(velocityY) > 500) {
          if (translateY.value < 0 && currentIndex === itemsLength - 1 && onEndReached)
            runOnJS(onEndReached)();

          // 수직 스와이프
          if (translationY < 0 && currentIndex < itemsLength - 1) {
            // 위로 스와이프 - 다음 아이템
            runOnJS(setCurrentIndex)(currentIndex + 1);
            translateY.value = withSpring(-(currentIndex + 1) * screenHeight, SPRING_CONFIG);
          } else if (translationY > 0 && currentIndex > 0) {
            // 아래로 스와이프 - 이전 아이템
            runOnJS(setCurrentIndex)(currentIndex - 1);
            translateY.value = withSpring(-(currentIndex - 1) * screenHeight, SPRING_CONFIG);
          } else {
            // 범위를 벗어나면 원래 위치로
            translateY.value = withSpring(-currentIndex * screenHeight, SPRING_CONFIG);
          }
        } else if (translationX < -100 || velocityX < -500) {
          // 왼쪽으로 충분히 스와이프하면 상세 뷰 열기
          runOnJS(setIsDetailOpen)(true);
          translateX.value = withSpring(0, SPRING_CONFIG);
        } else {
          // 원래 위치로 복귀
          translateY.value = withSpring(-currentIndex * screenHeight, SPRING_CONFIG);
          translateX.value = withSpring(screenWidth, SPRING_CONFIG);
        }
      }
    });

  useEffect(() => {
    onItemChange?.(currentIndex);
  }, [currentIndex]);

  useEffect(() => {
    onDetailToggle?.(currentIndex, isDetailOpen);
  }, [isDetailOpen]);

  return {
    currentIndex,
    isDetailOpen,
    animatedStyle,
    detailAnimatedStyle,
    gesture,
  };
};

export default useSwipeGestures;
