import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function QuizResultScreen() {
  const { score, total, quizId } = useLocalSearchParams<{
    score: string;
    total: string;
    quizId: string;
  }>();
  const router = useRouter();

  const scoreNum = parseInt(score || "0");
  const totalNum = parseInt(total || "0");
  const percentage = Math.round((scoreNum / totalNum) * 100);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-1 justify-center px-8 items-center">
        <View className="w-48 h-48 rounded-full bg-sky-50 items-center justify-center mb-10">
          <View className="w-36 h-36 rounded-full bg-sky-100 items-center justify-center">
            <Ionicons
              name={percentage >= 50 ? "trophy" : "ribbon"}
              size={80}
              color="#0EA5E9"
            />
          </View>
        </View>

        <Text className="text-3xl font-bold text-gray-900 mb-2 text-center">
          {percentage >= 80
            ? "Outstanding!"
            : percentage >= 50
              ? "Well Done!"
              : "Keep Practicing!"}
        </Text>
        <Text className="text-gray-400 text-lg text-center mb-10">
          You've completed the quiz and shown great effort.
        </Text>

        <View className="flex-row w-full justify-between mb-12">
          <View className="bg-gray-50 rounded-3xl p-6 items-center flex-1 mr-3 border border-gray-100">
            <Text className="text-gray-400 text-sm font-bold uppercase mb-1">
              Score
            </Text>
            <Text className="text-3xl font-black text-sky-500">
              {percentage}%
            </Text>
          </View>
          <View className="bg-gray-50 rounded-3xl p-6 items-center flex-1 ml-3 border border-gray-100">
            <Text className="text-gray-400 text-sm font-bold uppercase mb-1">
              Correct
            </Text>
            <Text className="text-3xl font-black text-gray-900">
              {scoreNum}/{totalNum}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => router.replace(`/quiz/play/${quizId}`)}
          className="bg-sky-500 w-full rounded-2xl py-5 items-center shadow-lg shadow-sky-200 mb-4"
        >
          <Text className="text-white font-bold text-lg">Restart Quiz</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.replace("/(tabs)/home")}
          className="border-2 border-sky-500 w-full rounded-2xl py-5 items-center bg-white"
        >
          <Text className="text-sky-500 font-bold text-lg">Back to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
