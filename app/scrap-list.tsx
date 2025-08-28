import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";

import type { NewsDto } from "@/types/dto";
import { getScrapedArticles } from "@/lib/apis/apis";
import ArticleCard from "@/components/features/my-page/article-card";
import { SafeAreaView } from "react-native-safe-area-context";

const H_PADDING = 16;
const GAP = 12;

export default function ScrapsPage() {
  const router = useRouter();
  const { width: screenWidth } = useWindowDimensions();
  const cardWidth = Math.floor((screenWidth - H_PADDING * 2 - GAP) / 2);

  const [items, setItems] = useState<NewsDto[]>([]);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [hasNext, setHasNext] = useState(true);

  const fetchMore = useCallback(async () => {
    if (loading || !hasNext) return;
    setLoading(true);
    const res = await getScrapedArticles(8, cursor);
    if (res.error) {
      setLoading(false);
      return;
    }
    const { data, pagination } = res;
    if (data) {
      setItems((prev) => [...prev, ...data]);
      setCursor(pagination?.nextCursor ?? undefined);
      setHasNext(pagination?.hasNext ?? false);
    }
    setLoading(false);
  }, [cursor, hasNext, loading]);

  useEffect(() => {
    fetchMore();
  }, []);

  const renderItem = ({ item, index }: { item: NewsDto; index: number }) => (
    <ArticleCard article={item} index={index} cardWidth={cardWidth} />
  );

  return (
    <SafeAreaView className="flex-1 bg-[#1F1F1F]">
      <View className="flex-row items-center justify-center px-4 h-20 relative">
        <Pressable
          onPress={() => router.back()}
          className="absolute left-4"
          hitSlop={30}
        >
          <MaterialIcons name="chevron-left" size={30} color="#FAFAFA" />
        </Pressable>
        <Text className="typography-small-title text-[#FAFAFA]">
          스크랩 목록
        </Text>
      </View>

      {items.length === 0 && !loading ? (
        <View className="flex-1 items-center justify-center">
          <FontAwesome name="bookmark" size={32} color="#666" />
          <Text className="mt-4 text-center text-sm text-[#FAFAFA]">
            아직 스크랩한 기사가 없어요.{"\n"}관심 기사를 스크랩 해보세요!
          </Text>
        </View>
      ) : (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          columnWrapperStyle={{ gap: GAP, justifyContent: "flex-start" }}
          contentContainerStyle={{
            paddingHorizontal: H_PADDING,
            paddingVertical: 16,
            rowGap: GAP,
          }}
          onEndReached={fetchMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loading ? (
              <View className="py-6 items-center justify-center">
                <ActivityIndicator color="#FAFAFA" />
              </View>
            ) : !hasNext && items.length > 0 ? (
              <Text className="py-6 text-center typography-caption3 text-[#FAFAFA]">
                마지막 기사입니다.
              </Text>
            ) : null
          }
          removeClippedSubviews
        />
      )}
    </SafeAreaView>
  );
}
