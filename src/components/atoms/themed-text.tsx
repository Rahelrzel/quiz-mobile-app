import { Text, TextProps } from "react-native";

export function ThemedText(props: TextProps) {
  return <Text className="text-gray-900" {...props} />;
}
