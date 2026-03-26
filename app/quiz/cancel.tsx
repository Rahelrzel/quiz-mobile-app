import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function PaymentCancel() {
  const { quizId } = useLocalSearchParams();
  const router = useRouter();

  return (
    <View className="flex-1 justify-center items-center bg-white p-6">
      <View className="w-20 h-20 rounded-full bg-red-100 items-center justify-center mb-6">
        <Ionicons name="close-circle" size={48} color="#ef4444" />
      </View>
      <Text className="text-2xl font-bold text-gray-900 mb-2">
        Payment Cancelled
      </Text>
      <Text className="text-gray-600 text-center mb-8">
        Your payment was cancelled. You can try again or continue with the free
        preview.
      </Text>
      <TouchableOpacity
        onPress={() =>
          router.replace({
            pathname: "/quiz/[quizId]",
            params: { quizId: quizId as string },
          })
        }
        className="bg-blue-500 py-4 px-8 rounded-xl"
      >
        <Text className="text-white font-bold text-lg">Return to Quiz</Text>
      </TouchableOpacity>
    </View>
  );
}
