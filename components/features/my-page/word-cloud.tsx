import React, { useMemo } from "react";
import { Dimensions, View } from "react-native";
import WordCloud from "rn-wordcloud";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

type Item = { keyword: string; count: number };

type CloudProps = {
  items: Item[];
  height?: number;
  colors?: string[];
  minFont?: number;
  maxFont?: number;
  fontFamily?: string;
  onWordPress?: (w: { text: string; value: number; color?: string }) => void;
};

const WordCloudRN: React.FC<CloudProps> = ({
  items = [],
  height = 208,
  colors = ["#ff904b", "#ffb764", "#ffd13c", "#ffeec3", "#1ab6b2"],
  minFont = 8,
  maxFont = 40,
  fontFamily = "NotoSansKR_Bold",
  onWordPress,
}) => {
  const words = useMemo(() => {
    const top = [...(items ?? [])]
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);

    return top.map((k, i) => ({
      text: k.keyword,
      value: k.count,
      color: colors[i % colors.length],
      fontFamily,
    }));
  }, [items, colors, fontFamily]);

  return (
    <View style={{ width: "100%", height }}>
      <WordCloud
        options={{
          words,
          verticalEnabled: false,
          minFont,
          maxFont,
          fontOffset: 1,
          width: SCREEN_WIDTH - 32,
          height,
          fontFamily,
        }}
        onWordPress={onWordPress}
      />
    </View>
  );
};

export default WordCloudRN;
