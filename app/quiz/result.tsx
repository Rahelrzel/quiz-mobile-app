import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const PRIMARY = "#db8300";

export default function QuizResultScreen() {
  const { score, total, quizId, passed, certificateId, answers } =
    useLocalSearchParams<{
      score: string;
      total: string;
      quizId: string;
      passed: string;
      certificateId: string;
      answers: string;
    }>();
  const router = useRouter();

  const scoreNum = parseInt(score || "0");
  const totalNum = parseInt(total || "0");
  const isPassed = passed === "true";

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-1 justify-center px-8 items-center">
        <View
          className="w-48 h-48 rounded-full items-center justify-center mb-10"
          style={{ backgroundColor: "#fff8eb" }}
        >
          <View
            className="w-36 h-36 rounded-full items-center justify-center"
            style={{ backgroundColor: "#ffedc2" }}
          >
            <Ionicons
              name={isPassed ? "trophy" : "ribbon"}
              size={80}
              color={PRIMARY}
            />
          </View>
        </View>

        <Text className="text-3xl font-bold text-gray-900 mb-2 text-center">
          {isPassed ? "Congratulations! You passed!" : "Keep Practicing!"}
        </Text>
        <Text className="text-gray-400 text-lg text-center mb-10">
          {isPassed
            ? "You've successfully completed the quiz and earned a certificate."
            : "You did not pass this quiz. Try again to improve your score."}
        </Text>

        <View className="flex-row w-full justify-between mb-12">
          <View className="bg-gray-50 rounded-3xl p-6 items-center flex-1 mr-3 border border-gray-100">
            <Text className="text-gray-400 text-sm font-bold uppercase mb-1">
              Score
            </Text>
            <Text className="text-3xl font-black" style={{ color: PRIMARY }}>
              {scoreNum}%
            </Text>
          </View>
          <View className="bg-gray-50 rounded-3xl p-6 items-center flex-1 ml-3 border border-gray-100">
            <Text className="text-gray-400 text-sm font-bold uppercase mb-1">
              Total Questions
            </Text>
            <Text className="text-3xl font-black text-gray-900">
              {totalNum}
            </Text>
          </View>
        </View>

        {isPassed && certificateId ? (
          <TouchableOpacity
            onPress={() => router.push(`/certificate/${certificateId}`)}
            className="w-full rounded-2xl py-5 items-center shadow-lg mb-4"
            style={{ backgroundColor: PRIMARY }}
          >
            <Text className="text-white font-bold text-lg">
              View Certificate
            </Text>
          </TouchableOpacity>
        ) : null}

        <TouchableOpacity
          onPress={() => router.replace(`/quiz/${quizId}`)}
          className="w-full rounded-2xl py-5 items-center mb-4 bg-white border-2"
          style={{ borderColor: PRIMARY }}
        >
          <Text className="font-bold text-lg" style={{ color: PRIMARY }}>
            Retake Quiz
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.replace("/home")}
          className="w-full rounded-2xl py-5 items-center"
        >
          <Text className="text-gray-400 font-bold text-lg">Back to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
