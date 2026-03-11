import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { mockQuizzes } from "@/src/data/mockQuizzes";

export default function QuizPlayerScreen() {
  const { quizId } = useLocalSearchParams<{ quizId: string }>();
  const router = useRouter();

  const quiz = mockQuizzes.find((q) => q.id === quizId);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);

  if (!quiz) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Quiz not found</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-sky-500 mt-4">Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentQuestion = quiz.questions[currentIndex];

  const handleSelectAnswer = (index: number) => {
    if (isAnswered) return;

    setSelectedAnswer(index);
    setIsAnswered(true);

    if (index === currentQuestion.correctAnswerIndex) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      router.push({
        pathname: "/quiz/result",
        params: {
          score,
          total: quiz.questions.length,
          quizId: quiz.id,
        },
      });
    }
  };

  const getOptionStyle = (index: number) => {
    if (!isAnswered) {
      return selectedAnswer === index
        ? "border-sky-500 bg-sky-50"
        : "border-gray-100 bg-white";
    }

    if (index === currentQuestion.correctAnswerIndex) {
      return "border-green-500 bg-green-50";
    }

    if (
      selectedAnswer === index &&
      selectedAnswer !== currentQuestion.correctAnswerIndex
    ) {
      return "border-red-500 bg-red-50";
    }

    return "border-gray-100 bg-gray-50 opacity-50";
  };

  const getOptionTextColor = (index: number) => {
    if (!isAnswered) {
      return selectedAnswer === index ? "text-sky-600" : "text-gray-700";
    }
    if (index === currentQuestion.correctAnswerIndex) return "text-green-700";
    if (selectedAnswer === index) return "text-red-700";
    return "text-gray-400";
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: quiz.title,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} className="ml-4">
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
          ),
        }}
      />

      <View className="flex-row px-6 py-4 items-center justify-between border-b border-gray-50">
        <View className="flex-1 h-2 bg-gray-100 rounded-full mr-4">
          <View
            className="h-2 bg-sky-500 rounded-full"
            style={{
              width: `${((currentIndex + 1) / quiz.questions.length) * 100}%`,
            }}
          />
        </View>
        <Text className="text-gray-400 font-bold">
          {currentIndex + 1}/{quiz.questions.length}
        </Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-8">
        <Text className="text-2xl font-bold text-gray-900 mb-8">
          {currentQuestion.question}
        </Text>

        <View className="space-y-4">
          {currentQuestion.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleSelectAnswer(index)}
              className={`border-2 rounded-2xl p-5 flex-row items-center mb-4 ${getOptionStyle(index)}`}
              activeOpacity={0.7}
            >
              <View
                className={`w-8 h-8 rounded-full border-2 items-center justify-center mr-4 
                ${
                  isAnswered && index === currentQuestion.correctAnswerIndex
                    ? "border-green-500 bg-green-500"
                    : isAnswered && selectedAnswer === index
                      ? "border-red-500 bg-red-500"
                      : selectedAnswer === index
                        ? "border-sky-500"
                        : "border-gray-200"
                }`}
              >
                {isAnswered &&
                (index === currentQuestion.correctAnswerIndex ||
                  selectedAnswer === index) ? (
                  <Ionicons
                    name={
                      index === currentQuestion.correctAnswerIndex
                        ? "checkmark"
                        : "close"
                    }
                    size={20}
                    color="white"
                  />
                ) : (
                  <Text
                    className={`font-bold ${selectedAnswer === index ? "text-sky-500" : "text-gray-400"}`}
                  >
                    {String.fromCharCode(65 + index)}
                  </Text>
                )}
              </View>
              <Text
                className={`flex-1 text-lg font-semibold ${getOptionTextColor(index)}`}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {isAnswered && (
          <View className="mt-8 bg-gray-50 rounded-3xl p-6 mb-10 border border-gray-100">
            <View className="flex-row items-center mb-3">
              <Ionicons name="information-circle" size={20} color="#0EA5E9" />
              <Text className="text-sky-600 font-bold ml-2">Explanation</Text>
            </View>
            <Text className="text-gray-600 leading-6 italic">
              {currentQuestion.explanation}
            </Text>
          </View>
        )}
      </ScrollView>

      <View className="px-6 py-6 border-t border-gray-50">
        <TouchableOpacity
          onPress={handleNext}
          disabled={!isAnswered}
          className={`rounded-2xl py-4 items-center shadow-lg shadow-sky-100 
            ${isAnswered ? "bg-sky-500" : "bg-gray-200 shadow-none"}`}
        >
          <Text className={`text-white font-bold text-lg`}>
            {currentIndex < quiz.questions.length - 1
              ? "Next Question"
              : "Finish Quiz"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
