import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as WebBrowser from "expo-web-browser";
import { saveQuizSession } from "../../services/quizSession";
import { useGlobalPayment } from "../../../hooks/usePayment";

// Amber/orange theme matching web app primary color (#db8300)
const THEME_COLOR = "#db8300";
const THEME_COLOR_LIGHT = "#fff8eb";

interface PaymentModalProps {
  visible: boolean;
  onClose: () => void;
  quizId: string | number;
  quizTitle: string;
  totalQuestions: number;
  currentQuestionIndex: number;
  selectedAnswers: any;
  shuffledQuestionIds: (number | string)[];
  onCancel: () => void;
  onPaymentComplete?: () => void;
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
  onPaymentComplete,
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
      // 1. Save quiz progress locally
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

      // 2. Also save to backend
      await saveQuizSession({
        quizId: Number(quizId),
        currentQuestionIndex,
        answers: selectedAnswers,
        questionOrder: shuffledQuestionIds.map(String),
        remainingTime: 0,
        language: "en",
        isCompleted: false,
      });

      // 3. Create checkout session
      const backendUrl =
        Platform.OS === "ios"
          ? "http://localhost:5001"
          : "http://10.0.2.2:5001";

      const successUrl = `${backendUrl}/api/payments/success?session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${backendUrl}/api/payments/cancel`;

      const checkoutUrl = await initiatePayment(
        String(quizId),
        currentQuestionIndex,
        selectedAnswers,
        shuffledQuestionIds.map(String),
        successUrl,
        cancelUrl,
      );

      // 4. Open Stripe checkout in native browser
      if (checkoutUrl) {
        const result = await WebBrowser.openAuthSessionAsync(
          checkoutUrl,
          "http://localhost:8081/payment-success",
        );

        if (result.type === "success" && onPaymentComplete) {
          onPaymentComplete();
          onClose();
        }
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
            <View
              className="w-16 h-16 rounded-full items-center justify-center mb-4"
              style={{ backgroundColor: THEME_COLOR_LIGHT }}
            >
              <Ionicons name="lock-closed" size={32} color={THEME_COLOR} />
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
                <Ionicons
                  name="checkmark-circle"
                  size={18}
                  color={THEME_COLOR}
                />
                <Text className="text-sm text-gray-600 flex-1">{feature}</Text>
              </View>
            ))}
          </View>

          {/* Price */}
          <View className="items-center mb-6">
            <View className="flex-row items-center gap-1 mb-2">
              <Ionicons name="sparkles" size={16} color={THEME_COLOR} />
              <Text className="text-sm text-gray-500">One-time payment</Text>
            </View>
            <Text className="text-4xl font-bold text-gray-900">$9.99</Text>
            <Text className="text-xs text-gray-500 mt-1">
              Lifetime access to all quizzes
            </Text>
          </View>

          {/* Pay Button */}
          <TouchableOpacity
            onPress={handlePayment}
            disabled={isPending}
            className="py-4 rounded-xl flex-row items-center justify-center gap-2 mb-3"
            style={{ backgroundColor: isPending ? "#6ee7b7" : THEME_COLOR }}
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

          {/* Cancel Button */}
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
