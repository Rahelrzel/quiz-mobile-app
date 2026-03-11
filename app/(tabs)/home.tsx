import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LayoutGrid, BookOpen, ShieldCheck } from "lucide-react-native";
import { useRouter } from "expo-router";
import { categories } from "@/src/data/mockQuizzes";
import QuizCategoryCard from "@/src/components/molecules/QuizCategoryCard";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6 pt-6">
          {/* Admin Button */}
          <TouchableOpacity
            onPress={() => router.push("/admin")}
            className="mb-8 bg-gray-900 flex-row items-center justify-center py-4 rounded-2xl shadow-lg shadow-gray-200"
          >
            <ShieldCheck size={20} color="white" />
            <Text className="text-white font-bold ml-3 text-lg">
              Admin Dashboard
            </Text>
          </TouchableOpacity>

          {/* Practice Quizzes Section */}
          <View className="mb-10">
            <View className="flex-row items-center mb-6">
              <LayoutGrid size={24} color="#0EA5E9" />
              <Text className="text-2xl font-bold text-gray-900 ml-3">
                Practice Quizzes
              </Text>
            </View>

            {categories.map((category) => (
              <QuizCategoryCard
                key={category.id}
                title={category.title}
                quizCount={category.count}
                onPress={() => router.push(`/quiz/${category.id}`)}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
