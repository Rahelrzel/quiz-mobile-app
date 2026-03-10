import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Button, WhiteSpace } from "@ant-design/react-native";
import { RotateCcw, Home, Award } from "lucide-react-native";
import ResultCard from "../components/ResultCard";

const QuizResultScreen = ({ route, navigation }: any) => {
  const { score, totalQuestions, timeSpent } = route.params || {
    score: 8,
    totalQuestions: 10,
    timeSpent: "02:45",
  };

  const isPassed = score / totalQuestions >= 0.8;

  return (
    <View className="flex-1 bg-gray-50">
      <View className="px-6 pt-12 pb-6 items-center">
        <Text className="text-xl font-bold text-gray-900">Quiz Result</Text>
      </View>

      <ScrollView className="flex-1 px-6">
        <View className="mt-4">
          <ResultCard
            score={score}
            totalQuestions={totalQuestions}
            timeSpent={timeSpent}
            isPassed={isPassed}
          />
        </View>

        <View className="mt-10 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <View className="flex-row items-center gap-3 mb-4">
            <Award size={24} color="#6366F1" />
            <Text className="text-lg font-bold text-gray-900">
              Performance Summary
            </Text>
          </View>

          <View className="space-y-4">
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-500">Accuracy</Text>
              <Text className="font-bold text-gray-900">
                {Math.round((score / totalQuestions) * 100)}%
              </Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-500">Questions Answered</Text>
              <Text className="font-bold text-gray-900">{totalQuestions}</Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-500">Points Earned</Text>
              <Text className="font-bold text-primary">+{score * 10}</Text>
            </View>
          </View>
        </View>

        <View className="h-10" />
      </ScrollView>

      <View className="px-6 py-6 pb-10 bg-white border-t border-gray-100 gap-4">
        <View className="flex-row gap-4">
          <TouchableOpacity
            className="flex-1 h-14 bg-gray-100 rounded-2xl items-center justify-center flex-row gap-2"
            onPress={() => navigation.navigate("StartQuiz")}
          >
            <RotateCcw size={20} color="#374151" />
            <Text className="text-gray-700 font-bold">Retake</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 h-14 bg-primary rounded-2xl items-center justify-center flex-row gap-2"
            onPress={() => navigation.navigate("Leaderboard")}
          >
            <Award size={20} color="white" />
            <Text className="text-white font-bold">Leaderboard</Text>
          </TouchableOpacity>
        </View>

        <Button
          onPress={() => navigation.navigate("MainTabs")}
          style={{ borderRadius: 16, height: 56, borderColor: "#6366F1" }}
        >
          <View className="flex-row items-center gap-2">
            <Home size={20} color="#6366F1" />
            <Text className="text-primary font-bold text-lg">Back to Home</Text>
          </View>
        </Button>
      </View>
    </View>
  );
};

export default QuizResultScreen;
