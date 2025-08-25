import NewsAbstractView from "@/components/features/news/news-abstract-view";
import NewsDetailView from "@/components/features/news/news-detail-view";
import Button from "@/components/ui/button";
import Text from "@/components/ui/text";
import { SITEMAP } from "@/data/sitemap";
import { postArticleEvent } from "@/lib/apis/apis";
import useFetchArticles from "@/lib/hooks/useFetchArticles";
import useSwipeGestures from "@/lib/hooks/useSwipeGestures";
import { router, useLocalSearchParams } from "expo-router";
import { View, Dimensions, Image, ActivityIndicator } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const FETCH_THRESHOLD = 5;

const ScrapPage = () => {
  const params = useLocalSearchParams();
  const initialIndex = params.index ? Number(params.index) : 0;

  const insets = useSafeAreaInsets();

  const {
    articles,
    isNextLoading,
    isPrevLoading,
    pagination,
    fetchNextArticles,
    fetchPrevArticles,
  } = useFetchArticles(initialIndex, {
    scraped: true,
  });
  const { currentIndex, animatedStyle, detailAnimatedStyle, gesture } = useSwipeGestures({
    itemsLength: articles.length + 1,
    onItemChange: async (index: number, goToItem: (index: number, animated?: boolean) => void) => {
      if (articles[index]?.id) postArticleEvent(articles[index].id, "VIEW");

      if (articles.length - index <= FETCH_THRESHOLD && !isNextLoading && pagination.hasNext)
        fetchNextArticles();

      if (index <= FETCH_THRESHOLD && !isPrevLoading && pagination.hasPrev) {
        const addedCount = await fetchPrevArticles();
        if (addedCount > 0) goToItem(currentIndex + addedCount, false);
      }
    },
    onDetailToggle: (index: number, isDetail: boolean) =>
      isDetail && articles[index]?.id && postArticleEvent(articles[index].id, "DETAIL_VIEW"),
    onEndReached: () => router.push(SITEMAP.MY_PAGE_SCRAP),
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={{ flex: 1 }}>
        {/* 메인 아이템들 */}
        <Animated.View style={[{ position: "absolute", width: "100%" }, animatedStyle]}>
          {articles &&
            articles.map((article) => <NewsAbstractView key={article.id} {...article} />)}

          {/* 로딩 인디케이터 */}
          {isNextLoading && (
            <View
              className="flex items-center justify-center"
              style={{ width: screenWidth, height: screenHeight }}
            >
              <ActivityIndicator size="large" color="#fff" />
            </View>
          )}

          {/* 뉴스 모두 확인 */}
          {!pagination?.hasNext && (
            <View
              className="items-center justify-center"
              style={{ width: screenWidth, height: screenHeight }}
            >
              <Text className="typography-sub-title">저장한 뉴스를 모두 확인했어요!</Text>
              <Image
                source={require("@/assets/images/thumbs-up.png")}
                style={{ width: 280, height: 280 }}
              />
              <Button
                onPress={() => router.push(SITEMAP.MY_PAGE_SCRAP)}
                className="absolute"
                style={{
                  bottom: insets.bottom + 20,
                  width: screenWidth - 40,
                }}
              >
                스크랩 목록으로 돌아가기
              </Button>
            </View>
          )}
        </Animated.View>

        {/* 상세 뷰 */}
        <Animated.View
          className="absolute top-0 left-0"
          style={[{ width: screenWidth, height: screenHeight }, detailAnimatedStyle]}
        >
          <NewsDetailView fullSummary={articles?.[currentIndex]?.fullSummary} />
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
};

export default ScrapPage;
