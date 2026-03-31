import React, { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "@/lib/axios";

export default function PaymentSuccess() {
  const { session_id } = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    handlePaymentSuccess();
  }, []);

  const getLatestQuizSession = async () => {
    try {
      const response = await api.get("/quiz-sessions/latest");
      return response.data;
    } catch {
      return null;
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      // Get saved quiz progress from AsyncStorage
      const savedProgress = await AsyncStorage.getItem("quiz_payment_progress");

      if (savedProgress) {
        const progress = JSON.parse(savedProgress);

        // Navigate back to quiz with the saved progress
        router.replace({
          pathname: `/quiz/${progress.quizId}`,
          params: {
            restore: "true",
            currentIndex: progress.currentQuestionIndex,
            answers: JSON.stringify(progress.selectedAnswers),
            questionOrder: JSON.stringify(progress.shuffledQuestionIds),
          },
        });

        // Clear saved progress
        await AsyncStorage.removeItem("quiz_payment_progress");
      } else {
        // Fallback: try to get latest quiz session from backend
        const latestSession = await getLatestQuizSession();
        if (latestSession) {
          router.replace({
            pathname: `/quiz/${latestSession.quizId}`,
            params: { restore: "true" },
          });
        } else {
          router.replace("/(tabs)");
        }
      }
    } catch (error) {
      console.error("Payment success handler error:", error);
      router.replace("/(tabs)");
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <ActivityIndicator size="large" color="#10b981" />
      <Text className="mt-4 text-gray-600">
        Payment successful! Returning to quiz...
      </Text>
    </View>
  );
}
