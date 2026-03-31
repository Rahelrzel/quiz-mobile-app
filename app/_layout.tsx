import { useEffect } from "react";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { saveAuthToken } from "@/utils/authStorage";
import { useRouter } from "expo-router";
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
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { useColorScheme } from "@/src/hooks/use-color-scheme";
import { PaymentProvider } from "@/src/context/PaymentContext";

const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  useEffect(() => {
    const handleDeepLink = async (event: { url: string }) => {
      const { url } = event;
      console.log("Deep link received:", url);

      if (url.includes("auth/success")) {
        const token = new URLSearchParams(url.split("?")[1]).get("token");
        if (token) {
          saveAuthToken(token);
          WebBrowser.dismissBrowser();
          // @ts-ignore
          router.replace("/(tabs)");
        }
      } else if (url.includes("payment-success")) {
        // Extract session_id from URL
        const params = new URLSearchParams(url.split("?")[1]);
        const sessionId = params.get("session_id");

        if (sessionId) {
          WebBrowser.dismissBrowser();
          router.replace(`/payment-success?session_id=${sessionId}` as any);
        }
      }
    };

    const subscription = Linking.addEventListener("url", handleDeepLink);

    // Check for initial URL
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    return () => subscription.remove();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <PaymentProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" options={{ title: "Home" }} />
              <Stack.Screen name="login" options={{ title: "Login" }} />
              <Stack.Screen name="register" options={{ title: "Register" }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="quizzes/[categoryId]"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="quiz/[quizId]"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="quiz/result"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="certificate/[certificateId]"
                options={{ title: "Certificate" }}
              />
              <Stack.Screen
                name="admin/index"
                options={{ headerShown: false }}
              />
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
          </PaymentProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
