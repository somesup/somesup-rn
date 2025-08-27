import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Modal,
  TouchableOpacity,
  Linking,
  Image,
} from "react-native";
import type { NewsProviderDto } from "@/types/dto";
import { MaterialIcons } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";

type NewsProviderProps = {
  providers: NewsProviderDto[];
  title?: string;
};

const ITEM_HEIGHT = 60;

const NewsProvider: React.FC<NewsProviderProps> = ({ providers, title }) => {
  const [open, setOpen] = useState(false);

  const uniqueProviders = providers.filter(
    (provider, index, self) =>
      index === self.findIndex((p) => p.id === provider.id)
  );

  return (
    <>
      <Pressable onPress={() => setOpen(true)}>
        <View className="flex-row">
          {uniqueProviders.slice(0, 3).map((provider) => (
            <View
              key={provider.id}
              className="w-6 h-6 rounded-full overflow-hidden -mr-2 bg-[#fafafa]"
            >
              <Image
                source={{ uri: provider.logoUrl }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
          ))}
        </View>
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable
          onPress={() => setOpen(false)}
          className="flex-1 bg-[#17171742] justify-end"
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            className="bg-[#2b2b2b] rounded-t-2xl p-4 w-full"
          >
            <View className="flex-row justify-between items-center mb-3">
              <View className="flex-row items-center pl-2">
                <Ionicons
                  name="sparkles-sharp"
                  size={12}
                  color="#FAFAFA"
                  style={{ marginRight: 6 }}
                />
                <Text className="text-white typography-caption3">
                  아래 뉴스들을 종합했어요!
                </Text>
              </View>
              <Pressable onPress={() => setOpen(false)}>
                <MaterialIcons name="close" size={24} color="#FAFAFA" />
              </Pressable>
            </View>

            <ScrollView
              style={{
                height:
                  uniqueProviders.length > 4
                    ? ITEM_HEIGHT * 4
                    : ITEM_HEIGHT * uniqueProviders.length,
              }}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: 12,
                paddingHorizontal: 12,
              }}
            >
              {uniqueProviders.map((provider, idx) => (
                <TouchableOpacity
                  key={provider.id}
                  onPress={() => Linking.openURL(provider.newsUrl)}
                  activeOpacity={0.7}
                  className="flex-row items-center mb-5"
                  style={{ height: ITEM_HEIGHT - 12 }}
                >
                  <View className="w-12 h-12 rounded-full overflow-hidden mr-3 bg-[#fafafa]">
                    <Image
                      source={{ uri: provider.logoUrl }}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  </View>
                  <View className="flex-1 ml-1">
                    <Text
                      className="text-[#ffffff] typography-caption2 mb-[-7]"
                      numberOfLines={1}
                    >
                      기사 원제목
                    </Text>
                    <Text className="text-[#9b9a9a] typography-caption3">
                      {provider.friendlyName}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

export default NewsProvider;
