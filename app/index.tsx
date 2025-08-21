import Text from "@/components/ui/text";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 items-center justify-center">
        <Text className="typography-main-title">Welcome to Somesup RN!</Text>
      </View>
    </SafeAreaView>
  );
}
