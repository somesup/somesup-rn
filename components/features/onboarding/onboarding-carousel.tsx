import React, { ReactNode, useEffect, useRef, useState } from "react";
import { View } from "react-native";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";
import useRefWidth from "@/lib/hooks/useRefWidth";

type OnboardingCarouselProps = {
  gap?: number;
  children: ReactNode[] | ReactNode;
  autoPlayInterval?: number;
  className?: string;
};

const OnboardingCarousel = ({
  children,
  gap = 0,
  autoPlayInterval = 1500,
  className = "",
}: OnboardingCarouselProps) => {
  const originalItems = React.Children.toArray(children);
  const totalItems = originalItems.length;
  const items = totalItems ? [...originalItems, ...originalItems, ...originalItems] : [];

  const containerRef = useRef<View>(null);
  const [currentIndex, setCurrentIndex] = useState(totalItems);
  const [isTransitioning, setIsTransitioning] = useState(true);

  const containerWidth = useRefWidth(containerRef);
  const cellWidth = 200;
  const centerOffset = containerWidth > 0 ? (containerWidth - cellWidth) / 2 : 0;
  const translateX = useSharedValue(-totalItems * (cellWidth + gap));

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlayInterval]);

  useEffect(() => {
    if (currentIndex >= totalItems * 2) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(totalItems);

        setTimeout(() => {
          setIsTransitioning(true);
        }, 16);
      }, 400);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, totalItems, isTransitioning]);

  useEffect(() => {
    if (containerWidth > 0) {
      const newTranslateX = centerOffset - currentIndex * (cellWidth + gap);
      translateX.value = withTiming(newTranslateX, {
        duration: isTransitioning ? 400 : 0,
      });
    }
  }, [currentIndex, centerOffset, cellWidth, gap, isTransitioning, translateX, containerWidth]);

  return (
    <View ref={containerRef} className={`relative w-full overflow-hidden ${className}`}>
      <Animated.View
        className="flex-row"
        style={{
          transform: [{ translateX: translateX }],
          gap: gap,
        }}
      >
        {items.map((child, index) => (
          <View key={index} className="flex-shrink-0" style={{ width: cellWidth }}>
            {child}
          </View>
        ))}
      </Animated.View>
    </View>
  );
};

export default OnboardingCarousel;
