import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { mockQuizzes, categories } from "@/src/data/mockQuizzes";

export default function CategoryQuizzesScreen() {
  const { category: categoryId } = useLocalSearchParams<{ category: string }>();
  const router = useRouter();

  const category = categories.find((c) => c.id === categoryId);
  const filteredQuizzes = mockQuizzes.filter((q) => q.category === categoryId);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: category?.title || "Quizzes",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} className="ml-4">
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView className="flex-1 px-6 pt-6">
        <Text className="text-3xl font-bold text-gray-900 mb-2">
          {category?.title} Quizzes
        </Text>
        <Text className="text-gray-500 mb-8">
          Choose a quiz to test your knowledge
        </Text>

        {filteredQuizzes.length > 0 ? (
          filteredQuizzes.map((quiz) => (
            <TouchableOpacity
              key={quiz.id}
              className="bg-white border border-gray-100 rounded-3xl p-6 mb-6 shadow-sm shadow-gray-200"
              onPress={() => router.push(`/quiz/play/${quiz.id}`)}
              activeOpacity={0.7}
            >
              <Text className="text-xl font-bold text-gray-900 mb-2">
                {quiz.title}
              </Text>
              <Text className="text-gray-400 mb-6">
                Test your {category?.title.toLowerCase()} knowledge
              </Text>

              <View className="flex-row items-center mb-6">
                <View className="flex-row items-center mr-6">
                  <Ionicons
                    name="help-circle-outline"
                    size={20}
                    color="#9CA3AF"
                  />
                  <Text className="text-gray-500 ml-1.5 text-sm font-medium">
                    {quiz.questions.length} questions
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Ionicons name="flash-outline" size={20} color="#9CA3AF" />
                  <Text className="text-gray-500 ml-1.5 text-sm font-medium">
                    Intermediate
                  </Text>
                </View>
              </View>

              <View className="bg-sky-500 rounded-2xl py-4 items-center">
                <Text className="text-white font-bold text-lg">Start Quiz</Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View className="mt-20 items-center">
            <Ionicons name="alert-circle-outline" size={64} color="#E5E7EB" />
            <Text className="text-gray-400 mt-4 text-lg">
              No quizzes found in this category
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
