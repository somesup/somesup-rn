import NewsAbstractView from "@/components/features/news/news-abstract-view";
import NewsDetailView from "@/components/features/news/news-detail-view";
import Text from "@/components/ui/text";
import { toast } from "@/components/ui/toast";
import { postArticleEvent } from "@/lib/apis/apis";
import useFetchArticles from "@/lib/hooks/useFetchArticles";
import useSwipeGestures from "@/lib/hooks/useSwipeGestures";
import { useHighlightStore } from "@/lib/stores/highlight";
import { useEffect } from "react";
import { View, Dimensions, Image, ActivityIndicator } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const FETCH_THRESHOLD = 5;

const HomePage = () => {
  const isVisited = useHighlightStore((state) => state.isVisited);

  const { articles, isNextLoading, pagination, fetchNextArticles } = useFetchArticles(0);
  const { currentIndex, animatedStyle, detailAnimatedStyle, gesture } = useSwipeGestures({
    itemsLength: articles.length + 1,
    onItemChange: async (index: number) => {
      if (articles[index]?.id) postArticleEvent(articles[index].id, "VIEW");
      if (articles.length - index <= FETCH_THRESHOLD && !isNextLoading && pagination.hasNext)
        fetchNextArticles();
    },
    onDetailToggle: (index: number, isDetail: boolean) =>
      isDetail && articles[index]?.id && postArticleEvent(articles[index].id, "DETAIL_VIEW"),
  });

  useEffect(() => {
    if (!isVisited()) toast.fiveNews();
  }, []);

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
              <Text className="typography-sub-title">오늘의 뉴스를 모두 확인했어요 !</Text>
              <Image
                source={require("@/assets/images/thumbs-up.png")}
                style={{ width: 280, height: 280 }}
              />
              <Text className="!font-normal typography-small-title">
                벌써 {articles.length}개의 소식을 읽었어요
              </Text>
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

export default HomePage;
