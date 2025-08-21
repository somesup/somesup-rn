import { cn } from "@/lib/utils";
import { Text as RNText, TextProps } from "react-native";

export default function Text(props: TextProps) {
  return <RNText {...props} className={cn("text-gray-60", props.className)} />;
}
