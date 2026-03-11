import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { mockQuizzes, categories } from "@/src/data/mockQuizzes";

export default function ManageQuizzes() {
  const [quizzes, setQuizzes] = useState(mockQuizzes);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Programming");
  const [passingScore, setPassingScore] = useState("70");

  const handleAdd = () => {
    if (!title) return;
    const newQuiz = {
      id: "quiz-" + Date.now(),
      title,
      category: category.toLowerCase(),
      passingScore: parseInt(passingScore),
      questions: [],
    };
    setQuizzes([...quizzes, newQuiz as any]);
    setTitle("");
    setShowForm(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <Stack.Screen options={{ title: "Manage Quizzes", headerShown: true }} />
      <ScrollView className="flex-1 px-6 pt-6">
        <View className="flex-row justify-between items-center mb-8">
          <Text className="text-2xl font-bold text-gray-900">Quizzes</Text>
          <TouchableOpacity
            onPress={() => setShowForm(!showForm)}
            className="bg-emerald-500 p-2 rounded-full"
          >
            <Ionicons
              name={showForm ? "close" : "add"}
              size={32}
              color="white"
            />
          </TouchableOpacity>
        </View>

        {showForm && (
          <View className="bg-gray-50 p-6 rounded-3xl mb-8 border border-gray-100">
            <Text className="text-gray-900 font-bold mb-2">Quiz Title</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. JavaScript Advanced"
              className="bg-white p-4 rounded-xl mb-4 border border-gray-200"
            />
            <Text className="text-gray-900 font-bold mb-2">Category</Text>
            <View className="flex-row flex-wrap mb-4">
              {categories.map((cat, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => setCategory(cat.title)}
                  className={`mr-2 mb-2 px-4 py-2 rounded-full ${category === cat.title ? "bg-emerald-500" : "bg-white border border-gray-200"}`}
                >
                  <Text
                    className={
                      category === cat.title
                        ? "text-white font-bold"
                        : "text-gray-500"
                    }
                  >
                    {cat.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text className="text-gray-900 font-bold mb-2">
              Passing Score (%)
            </Text>
            <TextInput
              value={passingScore}
              onChangeText={setPassingScore}
              keyboardType="number-pad"
              className="bg-white p-4 rounded-xl mb-6 border border-gray-200"
            />
            <TouchableOpacity
              onPress={handleAdd}
              className="bg-emerald-500 py-4 rounded-xl items-center"
            >
              <Text className="text-white font-bold text-lg">Save Quiz</Text>
            </TouchableOpacity>
          </View>
        )}

        {quizzes.map((quiz, idx) => (
          <View
            key={idx}
            className="flex-row items-center p-4 border border-gray-100 rounded-2xl mb-4 shadow-sm bg-white"
          >
            <View className="bg-emerald-50 p-3 rounded-xl mr-4">
              <Ionicons name="journal" size={24} color="#10b981" />
            </View>
            <View className="flex-1">
              <Text className="text-gray-900 font-bold text-lg leading-6">
                {quiz.title}
              </Text>
              <View className="flex-row items-center mt-1">
                <Text className="text-emerald-600 text-xs font-bold uppercase">
                  {quiz.category}
                </Text>
                <Text className="text-gray-300 mx-2">•</Text>
                <Text className="text-gray-400 text-xs">
                  {quiz.questions.length} questions
                </Text>
              </View>
            </View>
            <TouchableOpacity className="p-2">
              <Ionicons name="trash-outline" size={20} color="#ef4444" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
