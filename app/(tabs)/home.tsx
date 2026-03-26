import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LayoutGrid, Globe, ChevronDown } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useQuizCategories } from "@/hooks/useQuizzes";
import { Ionicons } from "@expo/vector-icons";
import QuizCategoryCard from "@/src/components/molecules/QuizCategoryCard";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "fr", label: "French" },
  { code: "es", label: "Spanish" },
  { code: "de", label: "German" },
  { code: "it", label: "Italian" },
];

export default function HomeScreen() {
  const router = useRouter();
  const [language, setLanguage] = useState("en");
  const {
    data: categories,
    isLoading,
    isError,
    error,
  } = useQuizCategories(language);

  const handleLanguageChange = () => {
    Alert.alert(
      "Select Language",
      "Choose your preferred language",
      LANGUAGES.map((lang) => ({
        text: lang.label,
        onPress: () => setLanguage(lang.code),
      })),
      { cancelable: true },
    );
  };

  const selectedLanguageLabel =
    LANGUAGES.find((l) => l.code === language)?.label || "English";

  // Skeleton Loader for Categories
  const renderSkeletons = () => (
    <View className="mb-10">
      <View className="flex-row items-center mb-6">
        <View className="w-6 h-6 bg-gray-200 rounded-md" />
        <View className="w-48 h-8 bg-gray-200 rounded-lg ml-3" />
      </View>
      {[1, 2, 3, 4].map((i) => (
        <View
          key={i}
          className="bg-gray-100 rounded-2xl h-40 mb-4 animate-pulse"
        />
      ))}
    </View>
  );

  if (isError) {
    return (
      <View className="flex-1 justify-center items-center bg-white px-6">
        <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
        <Text className="mt-4 text-xl font-bold text-gray-900 text-center">
          Failed to load quizzes
        </Text>
        <Text className="mt-2 text-gray-500 text-center">
          {(error as any)?.message || "An error occurred while fetching data."}
        </Text>
        <TouchableOpacity
          onPress={() => router.replace("/home")}
          className="mt-6 bg-sky-500 px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-bold">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/* Header with Language Selector */}
      <View className="flex-row justify-between items-center px-6 py-4 border-b border-gray-100">
        <View className="flex-row items-center">
          <View className="bg-sky-500 rounded-xl p-2 mr-2">
            <Ionicons name="school" size={24} color="white" />
          </View>
          <Text className="text-xl font-bold text-gray-900">
            Job<Text className="text-sky-500">Prep</Text>
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleLanguageChange}
          className="flex-row items-center border border-gray-200 rounded-lg px-3 py-1.5 bg-white"
        >
          <Globe size={16} color="#4B5563" />
          <Text className="text-gray-600 font-medium mx-1.5 text-sm">
            {selectedLanguageLabel}
          </Text>
          <ChevronDown size={14} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6 pt-6">
          {isLoading ? (
            renderSkeletons()
          ) : (
            <View className="mb-10">
              <View className="flex-row items-center mb-6">
                <LayoutGrid size={24} color="#0EA5E9" />
                <Text className="text-2xl font-bold text-gray-900 ml-3">
                  Practice Quizzes
                </Text>
              </View>

              {/* Category List */}
              {categories?.map((category) => (
                <QuizCategoryCard
                  key={category.id}
                  title={category.name}
                  quizCount={category.quizCount}
                  onPress={() =>
                    router.push({
                      pathname: `/quizzes/${category.id}` as any,
                      params: { lang: language },
                    })
                  }
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
