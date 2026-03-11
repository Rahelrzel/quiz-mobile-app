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
import { mockQuizzes } from "@/src/data/mockQuizzes";

export default function ManageQuestions() {
  const [questions, setQuestions] = useState(mockQuizzes[0].questions);
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
    if (!text) return;
    const newQ = {
      question: text,
      options,
      correctAnswerIndex: correctIdx,
      explanation,
    };
    setQuestions([...questions, newQ as any]);
    setText("");
    setOptions(["", "", "", ""]);
    setShowForm(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <Stack.Screen
        options={{ title: "Manage Questions", headerShown: true }}
      />
      <ScrollView className="flex-1 px-6 pt-6">
        <View className="flex-row justify-between items-center mb-8">
          <Text className="text-2xl font-bold text-gray-900">Questions</Text>
          <TouchableOpacity
            onPress={() => setShowForm(!showForm)}
            className="bg-orange-500 p-2 rounded-full"
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
                  />
                  <TouchableOpacity
                    onPress={() => setCorrectIdx(i)}
                    className={`w-10 h-10 rounded-full items-center justify-center border-2 ${correctIdx === i ? "border-emerald-500 bg-emerald-500" : "border-gray-200"}`}
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
            />
            <TouchableOpacity
              onPress={handleAdd}
              className="bg-orange-500 py-4 rounded-xl items-center"
            >
              <Text className="text-white font-bold text-lg">
                Save Question
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {questions.map((q, idx) => (
          <View
            key={idx}
            className="p-6 border border-gray-100 rounded-3xl mb-6 bg-white shadow-sm"
          >
            <Text className="text-gray-900 font-bold text-lg mb-4">
              {q.question}
            </Text>
            <View className="space-y-2">
              {q.options.map((opt, i) => (
                <View
                  key={i}
                  className={`flex-row items-center p-3 rounded-xl ${q.correctAnswerIndex === i ? "bg-emerald-50 border border-emerald-100" : "bg-gray-50"}`}
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
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
