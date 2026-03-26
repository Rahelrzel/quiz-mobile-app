import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useQuizzes, useCreateQuestion, useQuizById } from "@/hooks/useQuizzes";

export default function ManageQuestions() {
  const { data: quizzes, isLoading: loadingQuizzes } = useQuizzes("en");
  const [selectedQuizId, setSelectedQuizId] = useState<number | null>(null);

  const { data: quizData, isLoading: loadingQuiz } = useQuizById(
    selectedQuizId || 0,
  );
  const { mutate: createQuestion, isPending } = useCreateQuestion();

  const [showForm, setShowForm] = useState(false);
  const [text, setText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctIdx, setCorrectIdx] = useState(0);
  const [explanation, setExplanation] = useState("");

  const updateOption = (idx: number, val: string) => {
    const next = [...options];
    next[idx] = val;
    setOptions(next);
  };

  const handleAdd = () => {
    if (!selectedQuizId) {
      Alert.alert("Error", "Please select a quiz first.");
      return;
    }
    if (!text.trim() || options.some((opt) => !opt.trim())) {
      Alert.alert("Error", "Question text and all options are required.");
      return;
    }

    createQuestion(
      {
        quizId: selectedQuizId,
        data: {
          questionText: text.trim(),
          options: options.map((opt) => opt.trim()),
          correctAnswerIndex: correctIdx,
          explanation: explanation.trim(),
          language: "en",
        },
      },
      {
        onSuccess: () => {
          Alert.alert("Success", "Question added successfully");
          setText("");
          setOptions(["", "", "", ""]);
          setExplanation("");
          setCorrectIdx(0);
          setShowForm(false);
        },
        onError: (error: any) => {
          Alert.alert(
            "Error",
            error.message || "Something went wrong while creating the item.",
          );
        },
      },
    );
  };

  const renderSkeletons = () => (
    <View>
      {[1, 2, 3].map((i) => (
        <View
          key={i}
          className="p-6 border border-gray-100 rounded-3xl mb-6 bg-gray-50 h-40 animate-pulse"
        />
      ))}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <Stack.Screen
        options={{ title: "Manage Questions", headerShown: true }}
      />
      <ScrollView className="flex-1 px-6 pt-6">
        <View className="mb-6">
          <Text className="text-gray-900 font-bold mb-3">Select Quiz</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row"
          >
            {quizzes?.map((quiz) => (
              <TouchableOpacity
                key={quiz.id}
                onPress={() => setSelectedQuizId(quiz.id)}
                className={`mr-3 px-4 py-2 rounded-full border ${selectedQuizId === quiz.id ? "bg-orange-500 border-orange-500" : "bg-white border-gray-200"}`}
              >
                <Text
                  className={
                    selectedQuizId === quiz.id
                      ? "text-white font-bold"
                      : "text-gray-500"
                  }
                >
                  {quiz.translations?.[0]?.title || quiz.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View className="flex-row justify-between items-center mb-8">
          <Text className="text-2xl font-bold text-gray-900">Questions</Text>
          <TouchableOpacity
            onPress={() => setShowForm(!showForm)}
            className="bg-orange-500 p-2 rounded-full"
            disabled={!selectedQuizId || isPending}
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
            <Text className="text-gray-900 font-bold mb-2">Question Text</Text>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Enter your question"
              className="bg-white p-4 rounded-xl mb-4 border border-gray-200"
              editable={!isPending}
            />
            {options.map((opt, i) => (
              <View key={i} className="mb-4">
                <Text className="text-gray-900 font-bold mb-2">
                  Option {String.fromCharCode(65 + i)}
                </Text>
                <View className="flex-row items-center gap-x-3">
                  <TextInput
                    value={opt}
                    onChangeText={(v) => updateOption(i, v)}
                    placeholder={`Answer ${i + 1}`}
                    className="flex-1 bg-white p-4 rounded-xl border border-gray-200"
                    editable={!isPending}
                  />
                  <TouchableOpacity
                    onPress={() => setCorrectIdx(i)}
                    className={`w-10 h-10 rounded-full items-center justify-center border-2 ${correctIdx === i ? "border-emerald-500 bg-emerald-500" : "border-gray-200"}`}
                    disabled={isPending}
                  >
                    <Ionicons
                      name="checkmark"
                      size={24}
                      color={correctIdx === i ? "white" : "#E5E7EB"}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
            <Text className="text-gray-900 font-bold mb-2">Explanation</Text>
            <TextInput
              value={explanation}
              onChangeText={setExplanation}
              placeholder="Why is it correct?"
              className="bg-white p-4 rounded-xl mb-6 border border-gray-200"
              editable={!isPending}
            />
            <TouchableOpacity
              onPress={handleAdd}
              className={`py-4 rounded-xl items-center ${isPending ? "bg-gray-300" : "bg-orange-500"}`}
              disabled={isPending}
            >
              {isPending ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-bold text-lg">
                  Save Question
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {loadingQuiz ? (
          renderSkeletons()
        ) : !selectedQuizId ? (
          <View className="py-20 items-center">
            <Ionicons name="help-circle-outline" size={64} color="#E5E7EB" />
            <Text className="text-gray-400 mt-4 font-medium">
              Please select a quiz to see questions
            </Text>
          </View>
        ) : quizData?.questions?.length === 0 ? (
          <View className="py-20 items-center">
            <Text className="text-gray-400 font-medium">
              No questions added yet
            </Text>
          </View>
        ) : (
          quizData?.questions?.map((q, idx) => (
            <View
              key={q.id || idx}
              className="p-6 border border-gray-100 rounded-3xl mb-6 bg-white shadow-sm"
            >
              <Text className="text-gray-900 font-bold text-lg mb-4">
                {q.questionText}
              </Text>
              <View className="space-y-2">
                {q.options.map((opt, i) => (
                  <View
                    key={i}
                    className={`flex-row items-center p-3 rounded-xl mb-2 ${q.correctAnswerIndex === i ? "bg-emerald-50 border border-emerald-100" : "bg-gray-50"}`}
                  >
                    <Text
                      className={`font-bold mr-3 ${q.correctAnswerIndex === i ? "text-emerald-600" : "text-gray-400"}`}
                    >
                      {String.fromCharCode(65 + i)}
                    </Text>
                    <Text
                      className={
                        q.correctAnswerIndex === i
                          ? "text-emerald-700 font-medium"
                          : "text-gray-600"
                      }
                    >
                      {opt}
                    </Text>
                  </View>
                ))}
              </View>
              {q.explanation && (
                <View className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-100">
                  <Text className="text-amber-800 text-sm italic">
                    <Text className="font-bold">Explanation: </Text>
                    {q.explanation}
                  </Text>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
