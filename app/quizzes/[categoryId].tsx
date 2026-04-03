import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useQuizzesByCategory, useQuizCategories } from "@/hooks/useQuizzes";

const PRIMARY = "#db8300";

export default function CategoryQuizzesScreen() {
  const { categoryId, lang: langParam } = useLocalSearchParams<{
    categoryId: string;
    lang?: string;
  }>();
  const lang = langParam || "en";
  const router = useRouter();

  const { data: categories } = useQuizCategories(lang);
  const {
    data: quizzes,
    isLoading,
    isError,
    error,
  } = useQuizzesByCategory(categoryId, lang);

  const category = categories?.find((c) => String(c.id) === categoryId);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color={PRIMARY} />
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 justify-center items-center bg-white px-6">
        <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
        <Text className="mt-4 text-xl font-bold text-gray-900 text-center">
          Failed to load quizzes
        </Text>
        <Text className="mt-2 text-gray-500 text-center">
          {(error as any)?.message || "An error occurred."}
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: category?.name || "Quizzes",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} className="ml-4">
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView className="flex-1 px-6 pt-6">
        <Text className="text-3xl font-bold text-gray-900 mb-2">
          {category?.name} Quizzes
        </Text>
        <Text className="text-gray-500 mb-8">
          Choose a quiz to test your knowledge
        </Text>

        {quizzes && quizzes.length > 0 ? (
          quizzes.map((quiz) => {
            const translation =
              quiz.translations?.find((t) => t.language === "en") ||
              quiz.translations?.[0];

            return (
              <TouchableOpacity
                key={quiz.id}
                className="bg-white border border-gray-100 rounded-3xl p-6 mb-6 shadow-sm shadow-gray-200"
                onPress={() =>
                  router.push({
                    pathname: `/quiz/${quiz.id}` as any,
                    params: { lang },
                  })
                }
                activeOpacity={0.7}
              >
                <Text className="text-xl font-bold text-gray-900 mb-2">
                  {translation?.title || quiz.title || "Untitled Quiz"}
                </Text>
                <Text className="text-gray-400 mb-6" numberOfLines={2}>
                  {translation?.description ||
                    "Test your knowledge in this category."}
                </Text>

                <View className="flex-row items-center mb-6">
                  <View className="flex-row items-center mr-6">
                    <Ionicons name="star-outline" size={20} color="#9CA3AF" />
                    <Text className="text-gray-500 ml-1.5 text-sm font-medium">
                      {quiz.totalPoints} pts
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Ionicons name="time-outline" size={20} color="#9CA3AF" />
                    <Text className="text-gray-500 ml-1.5 text-sm font-medium">
                      {quiz.timeLimit} min
                    </Text>
                  </View>
                </View>

                <View
                  className="rounded-2xl py-4 items-center"
                  style={{ backgroundColor: PRIMARY }}
                >
                  <Text className="text-white font-bold text-lg">
                    Start Quiz
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })
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
