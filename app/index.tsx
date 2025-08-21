import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Text from "../components/ui/text";

export default function App() {
  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 items-center justify-center">
        <Text className="typography-main-title">Welcome to Somesup RN!</Text>
        <Text className="typography-body2  mt-2">React Native with NativeWind</Text>
      </View>
    </SafeAreaView>
  );
}
