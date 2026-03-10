import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Button, List, Icon } from "@ant-design/react-native";
import { AlertTriangle, CheckCircle, ArrowLeft } from "lucide-react-native";
import { quizzes } from "../mock/quizzes";

const StartQuizScreen = ({ route, navigation }: any) => {
  const { quizId } = route.params || { quizId: "1" };
  const quiz = quizzes.find((q) => q.id === quizId) || quizzes[0];

  const instructions = [
    "You have 15 minutes to complete the quiz.",
    "Once you start, you cannot pause the timer.",
    "Each question has only one correct answer.",
    "You need 80% or more to pass and earn a certificate.",
  ];

  return (
    <View className="flex-1 bg-white">
      <View className="px-6 pt-12 pb-6 border-b border-gray-100">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-900">
            Quiz Instructions
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 pt-8">
        <View className="items-center mb-8">
          <View className="w-20 h-20 bg-primary/10 rounded-full items-center justify-center mb-4">
            <Icon name="file-text" size="lg" color="#6366F1" />
          </View>
          <Text className="text-2xl font-bold text-gray-900 text-center">
            {quiz.title}
          </Text>
          <Text className="text-gray-500 mt-1">
            Please read the following instructions carefully
          </Text>
        </View>

        <View className="bg-gray-50 rounded-3xl p-6 border border-gray-100 mb-8">
          {instructions.map((item, index) => (
            <View
              key={index}
              className="flex-row items-start gap-3 mb-4 last:mb-0"
            >
              <CheckCircle size={20} color="#22C55E" className="mt-0.5" />
              <Text className="flex-1 text-gray-700 text-base leading-snug">
                {item}
              </Text>
            </View>
          ))}
        </View>

        <View className="bg-amber-50 rounded-2xl p-4 border border-amber-100 flex-row items-center gap-3">
          <AlertTriangle size={24} color="#D97706" />
          <Text className="flex-1 text-amber-800 text-sm font-medium">
            Ensure you have a stable internet connection before starting.
          </Text>
        </View>
      </ScrollView>

      <View className="px-6 py-8">
        <Button
          type="primary"
          style={{ borderRadius: 16, height: 60, backgroundColor: "#6366F1" }}
          onPress={() => navigation.navigate("Question", { quizId: quiz.id })}
        >
          <Text className="text-white font-bold text-xl">Start Quiz Now</Text>
        </Button>
      </View>
    </View>
  );
};

export default StartQuizScreen;
