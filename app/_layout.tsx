import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import "../src/global.css";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useColorScheme } from "@/src/hooks/use-color-scheme";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" options={{ title: "Home" }} />
          <Stack.Screen name="login" options={{ title: "Login" }} />
          <Stack.Screen name="register" options={{ title: "Register" }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="quiz/[category]"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="quiz/play/[quizId]"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="quiz/result" options={{ headerShown: false }} />
          <Stack.Screen name="admin/index" options={{ headerShown: false }} />
          <Stack.Screen
            name="admin/categories/index"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="admin/courses/index"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="admin/quizzes/index"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="admin/questions/index"
            options={{ headerShown: false }}
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
