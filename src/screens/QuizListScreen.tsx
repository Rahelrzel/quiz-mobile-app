import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SearchBar, Tag } from "@ant-design/react-native";
import { ArrowLeft, Filter } from "lucide-react-native";
import QuizCard from "../components/QuizCard";
import { quizzes } from "../mock/quizzes";

const QuizListScreen = ({ navigation }: any) => {
  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white px-6 pt-12 pb-4 shadow-sm">
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-900">
            Explore Quizzes
          </Text>
          <TouchableOpacity>
            <Filter size={24} color="#6366F1" />
          </TouchableOpacity>
        </View>
        <SearchBar
          placeholder="Search by name or category..."
          showCancelButton={false}
          style={{ height: 40, backgroundColor: "#F3F4F6", borderRadius: 12 }}
        />
      </View>

      <ScrollView className="px-6 py-6" showsVerticalScrollIndicator={false}>
        <View className="flex-row gap-2 mb-6 overflow-hidden">
          {["All", "Programming", "Science", "General"].map((tag, i) => (
            <Tag
              key={i}
              selected={i === 0}
              style={{ borderRadius: 20, paddingHorizontal: 16 }}
            >
              {tag}
            </Tag>
          ))}
        </View>

        {quizzes.map((quiz) => (
          <QuizCard
            key={quiz.id}
            quiz={quiz}
            onPress={() =>
              navigation.navigate("QuizDetail", { quizId: quiz.id })
            }
          />
        ))}

        <View className="h-10" />
      </ScrollView>
    </View>
  );
};

export default QuizListScreen;
