import React from "react";
import { View, Text, Pressable, ImageBackground } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import type { NewsDto } from "@/types/dto";

type ArticleCardProps = {
  article: NewsDto;
  index: number;
  cardWidth: number;
};

const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  index,
  cardWidth,
}) => {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push(`/scrap?index=${index}`)}
      className="relative overflow-hidden rounded-xl"
      style={{
        width: cardWidth,
        aspectRatio: 10 / 16,
        alignSelf: "flex-start",
      }}
    >
      <ImageBackground
        source={{ uri: article.thumbnailUrl }}
        className="w-full h-full"
        resizeMode="cover"
      >
        <View className="absolute inset-0">
          <LinearGradient
            colors={["rgba(0,0,0,0.8)", "transparent"]}
            start={{ x: 0.5, y: 1 }}
            end={{ x: 0.5, y: 0.6 }}
            style={{ flex: 1 }}
          />
        </View>

        <View className="absolute bottom-0 left-0 right-0 p-3">
          <Text
            className="typography-caption2 text-[#FAFAFA]"
            numberOfLines={3}
          >
            {article.title}
          </Text>
        </View>
      </ImageBackground>
    </Pressable>
  );
};

export default ArticleCard;
