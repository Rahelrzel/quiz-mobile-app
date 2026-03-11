import { View, Text } from "react-native";
import { Link } from "expo-router";

export default function Index() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        Welcome to QuizApp
      </Text>
      <Link href="/login" style={{ marginTop: 10, color: "blue" }}>
        Go to Login
      </Link>
      <Link href="/register" style={{ marginTop: 10, color: "blue" }}>
        Go to Register
      </Link>
    </View>
  );
}
