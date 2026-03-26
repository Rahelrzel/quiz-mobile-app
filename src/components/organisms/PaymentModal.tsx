import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Linking from "expo-linking";
import { saveQuizSession } from "../../services/quizSession";
import { useGlobalPayment } from "../../../hooks/usePayment";

interface PaymentModalProps {
  visible: boolean;
  onClose: () => void;
  quizId: string | number;
  quizTitle: string;
  totalQuestions: number;
  currentQuestionIndex: number;
  selectedAnswers: any; // Record<string, number | null>
  shuffledQuestionIds: (number | string)[];
  onCancel: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  visible,
  onClose,
  quizId,
  quizTitle,
  totalQuestions,
  currentQuestionIndex,
  selectedAnswers,
  shuffledQuestionIds,
  onCancel,
}) => {
  const [isPending, setIsPending] = useState(false);
  const { initiatePayment } = useGlobalPayment();

  const features = [
    "Unlock ALL quizzes on the platform",
    `Continue with all ${totalQuestions} questions`,
    "Detailed explanations for each answer",
    "Earn professional certificates",
    "Unlimited retakes forever",
  ];

  const handlePayment = async () => {
    setIsPending(true);
    try {
      // 1. Save quiz progress locally (like web's localStorage)
      const progress = {
        quizId: String(quizId),
        currentQuestionIndex,
        selectedAnswers,
        shuffledQuestionIds,
        timestamp: Date.now(),
      };
      await AsyncStorage.setItem(
        "quiz_payment_progress",
        JSON.stringify(progress),
      );

      // 2. Also save to backend (like web)
      await saveQuizSession({
        quizId: Number(quizId),
        currentQuestionIndex,
        answers: selectedAnswers,
        questionOrder: shuffledQuestionIds.map(String),
        remainingTime: 0,
        language: "en",
        isCompleted: false,
      });

      // 3. Create checkout session with success URL that includes payment success flag
      const successUrl = Linking.createURL("quiz/success", {
        queryParams: {
          quizId: String(quizId),
          payment_success: "true",
          currentIndex: currentQuestionIndex.toString(),
          answers: JSON.stringify(selectedAnswers),
          order: JSON.stringify(shuffledQuestionIds),
          session_id: "{CHECKOUT_SESSION_ID}",
        },
      });

      const cancelUrl = Linking.createURL("quiz/cancel", {
        queryParams: {
          quizId: String(quizId),
        },
      });

      const checkoutUrl = await initiatePayment(
        String(quizId),
        currentQuestionIndex,
        selectedAnswers,
        shuffledQuestionIds.map(String),
        successUrl,
        cancelUrl,
      );

      // 4. Open Stripe checkout in browser
      if (checkoutUrl) {
        await Linking.openURL(checkoutUrl);
      }
    } catch (error) {
      console.error("Payment initiation failed:", error);
      Alert.alert(
        "Payment Error",
        "Failed to initiate payment. Please check your internet connection and try again.",
      );
    } finally {
      setIsPending(false);
    }
  };

  const handleCancel = () => {
    onCancel();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleCancel}
    >
      <View className="flex-1 bg-black/50 justify-center items-center px-6">
        <View className="bg-white rounded-3xl p-6 w-full max-w-md">
          {/* Header */}
          <View className="items-center mb-6">
            <View className="w-16 h-16 rounded-full bg-blue-100 items-center justify-center mb-4">
              <Ionicons name="lock-closed" size={32} color="#3b82f6" />
            </View>
            <Text className="text-2xl font-bold text-center text-gray-900">
              Unlock All Quizzes
            </Text>
            <Text className="text-base text-center text-gray-600 mt-2">
              You've completed the free preview! Pay once to unlock all quizzes
              forever.
            </Text>
          </View>

          {/* Features */}
          <View className="bg-gray-50 rounded-xl p-4 mb-6">
            <Text className="font-semibold text-gray-900 mb-3">
              Currently taking: {quizTitle}
            </Text>
            {features.map((feature, index) => (
              <View key={index} className="flex-row items-center gap-2 mb-2">
                <Ionicons name="checkmark-circle" size={18} color="#3b82f6" />
                <Text className="text-sm text-gray-600 flex-1">{feature}</Text>
              </View>
            ))}
          </View>

          {/* Price */}
          <View className="items-center mb-6">
            <View className="flex-row items-center gap-1 mb-2">
              <Ionicons name="sparkles" size={16} color="#3b82f6" />
              <Text className="text-sm text-gray-500">One-time payment</Text>
            </View>
            <Text className="text-4xl font-bold text-gray-900">$9.99</Text>
            <Text className="text-xs text-gray-500 mt-1">
              Lifetime access to all quizzes
            </Text>
          </View>

          {/* Buttons */}
          <TouchableOpacity
            onPress={handlePayment}
            disabled={isPending}
            className="bg-blue-500 py-4 rounded-xl flex-row items-center justify-center gap-2 mb-3"
          >
            {isPending ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Ionicons name="card" size={20} color="white" />
                <Text className="text-white font-bold text-lg">
                  Pay & Continue Quiz
                </Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleCancel}
            disabled={isPending}
            className="bg-gray-100 py-4 rounded-xl flex-row items-center justify-center gap-2"
          >
            <Ionicons name="close" size={20} color="#6b7280" />
            <Text className="text-gray-600 font-semibold">Exit Quiz</Text>
          </TouchableOpacity>

          <Text className="text-[10px] text-center text-gray-400 mt-4 px-4">
            Secure payment powered by Stripe. Your payment information is never
            stored on our servers.
          </Text>
        </View>
      </View>
    </Modal>
  );
};
