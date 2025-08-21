// app/_layout.tsx
import "../global.css"; // CSS 파일 임포트
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
    </Stack>
  );
}
