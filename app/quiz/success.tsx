import React, { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useGlobalPayment } from "../../hooks/usePayment";
import { usePaymentStatus } from "../../src/context/PaymentContext";

export default function PaymentSuccess() {
  const { quizId, session_id, payment_success, currentIndex, answers, order } =
    useLocalSearchParams();
  const router = useRouter();
  const { verifyPayment, getSavedQuizProgress, clearSavedQuizProgress } =
    useGlobalPayment();
  const { setHasPaid } = usePaymentStatus();

  useEffect(() => {
    handlePaymentSuccess();
  }, [quizId, session_id]);

  const handlePaymentSuccess = async () => {
    try {
      // Verify payment with backend
      if (session_id) {
        await verifyPayment(session_id as string);
      }

      // Mark user as paid in global state
      setHasPaid(true);

      // Get saved progress from local storage
      const savedProgress = await getSavedQuizProgress();

      // Clear saved progress after restoring
      await clearSavedQuizProgress();

      // Navigate back to quiz with success flag and restored progress
      router.replace({
        pathname: "/quiz/[quizId]",
        params: {
          quizId: quizId as string,
          payment_success: "true",
          currentIndex:
            currentIndex ||
            savedProgress?.currentQuestionIndex.toString() ||
            "0",
          answers:
            answers || JSON.stringify(savedProgress?.selectedAnswers || {}),
          order:
            order || JSON.stringify(savedProgress?.shuffledQuestionIds || []),
        },
      });
    } catch (error) {
      console.error("Payment verification failed:", error);
      router.replace({
        pathname: "/quiz/[quizId]",
        params: { quizId: quizId as string },
      });
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <ActivityIndicator size="large" color="#3b82f6" />
      <Text className="mt-4 text-gray-600">Verifying payment...</Text>
    </View>
  );
}
