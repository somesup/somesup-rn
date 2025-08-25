import React, { useEffect, useRef } from "react";
import { View, ScrollView, SafeAreaView } from "react-native";
import { BlurView } from "expo-blur";
import Markdown from "react-native-markdown-display";
import Text from "@/components/ui/text";
import { NewsDto } from "@/types/dto";

type NewsDetailViewProps = Pick<NewsDto, "fullSummary">;

const NewsDetailView = ({ fullSummary }: NewsDetailViewProps) => {
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ y: 0, animated: false });
    }
  }, [fullSummary]);

  return (
    <View className="relative w-full h-full">
      <BlurView intensity={200} className="absolute inset-0 -z-10" />
      <View className="absolute inset-0 -z-10 bg-black/30" />
      <SafeAreaView className="h-full w-full">
        <ScrollView
          ref={scrollRef}
          className="h-full px-7 py-8"
          showsVerticalScrollIndicator={false}
        >
          <Markdown
            style={{
              body: { color: "#fafafa", fontSize: 16, lineHeight: 32, letterSpacing: -0.025 },
              paragraph: { marginBottom: 16 },
            }}
            mergeStyle={false}
            rules={{
              paragraph: (node, children, parent, styles) => (
                <Text key={node.key} style={[styles.paragraph, { marginBottom: 16 }]}>
                  {children}
                </Text>
              ),
            }}
          >
            {String(fullSummary || "")}
          </Markdown>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default React.memo(NewsDetailView);
