import React, { useState } from "react";
import { View, Image, TouchableOpacity, Dimensions, SafeAreaView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Text from "@/components/ui/text";
import { toast } from "@/components/ui/toast";
import {
  deleteArticleLike,
  deleteArticleScrap,
  postArticleLike,
  postArticleScrap,
} from "@/lib/apis/apis";
import { NewsDto } from "@/types/dto";
import { MaterialIcons } from "@expo/vector-icons";
import NewsProvider from "./news-provider";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

type NewsAbstractViewProps = Pick<
  NewsDto,
  "id" | "title" | "oneLineSummary" | "section" | "like" | "scrap" | "providers" | "thumbnailUrl"
>;

const NewsAbstractView = (news: NewsAbstractViewProps) => {
  const [isLiked, setIsLiked] = useState(news.like.isLiked);
  const [likeCount, setLikeCount] = useState(news.like.count);
  const [isScraped, setIsScrapped] = useState(news.scrap.isScraped);

  const handleToggleLike = async () => {
    if (isLiked) {
      setLikeCount((prev) => prev - 1);
      setIsLiked(false);
      const { error } = await deleteArticleLike(news.id);
      if (error) {
        setLikeCount((prev) => prev + 1);
        setIsLiked(true);
      }
    } else {
      setLikeCount((prev) => prev + 1);
      setIsLiked(true);
      const { error } = await postArticleLike(news.id);
      if (error) {
        setLikeCount((prev) => prev - 1);
        setIsLiked(false);
      }
    }
  };

  const handleToggleScrap = async () => {
    if (isScraped) {
      setIsScrapped(false);
      const { error } = await deleteArticleScrap(news.id);
      if (error) setIsScrapped(true);
    } else {
      setIsScrapped(true);
      toast.scrap();
      const { error } = await postArticleScrap(news.id);
      if (error) setIsScrapped(false);
    }
  };

  return (
    <View
      className="relative overflow-hidden"
      style={{
        width: screenWidth,
        height: screenHeight,
      }}
    >
      {/* Background Image */}
      <View className="absolute h-full w-full">
        <Image
          source={{ uri: news.thumbnailUrl }}
          className="absolute inset-0"
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
          blurRadius={20}
        />
        <View className="absolute inset-0 bg-black/20" />
        <LinearGradient
          colors={["rgba(0,0,0,0)", "transparent", "transparent", "rgba(0,0,0,1)"]}
          locations={[0, 0.25, 0.5, 1]}
          style={{ position: "absolute", top: 0, height: "100%", width: "100%" }}
        />
      </View>

      {/* Content */}
      <SafeAreaView className="w-full h-full">
        <Image
          source={{ uri: news.thumbnailUrl }}
          className="w-full flex-1 mb-72 "
          resizeMode="contain"
        />
        <View className="absolute bottom-0 w-full px-8 pb-10">
          <View className="flex-row items-baseline justify-between gap-4">
            <View className="flex-1">
              <View className="rounded-2xl border border-gray-60 px-2 self-start mb-2">
                <Text className="typography-caption ">{news.section.friendlyName}</Text>
              </View>
              <Text className="typography-sub-title-bold line-clamp-2">{news.title}</Text>
            </View>
            <View className="flex-col items-center justify-end gap-2">
              <TouchableOpacity
                className="flex-col items-center"
                onPress={handleToggleLike}
                activeOpacity={0.7}
              >
                {isLiked ? (
                  <MaterialIcons name="favorite" size={28} color="#FF3F62" />
                ) : (
                  <MaterialIcons name="favorite-border" size={28} color="#fafafa" />
                )}
                <Text className="typography-caption">{likeCount}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleToggleScrap} activeOpacity={0.7}>
                {isScraped ? (
                  <MaterialIcons name="bookmark" size={32} color="#fafafa" />
                ) : (
                  <MaterialIcons name="bookmark-border" size={32} color="#fafafa" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View className="h-px bg-gray-60 my-4" />

          <Text className="typography-body2 line-clamp-3 mb-4">{news.oneLineSummary}</Text>

          <View className="absolute bottom-10 right-8">
            <NewsProvider providers={news.providers}/>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default NewsAbstractView;
