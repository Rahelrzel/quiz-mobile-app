import React from "react";
import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { Button, Tag, List } from "@ant-design/react-native";
import {
  ArrowLeft,
  Clock,
  HelpCircle,
  Target,
  Award,
  ShieldCheck,
} from "lucide-react-native";
import { quizzes } from "../mock/quizzes";

const QuizDetailScreen = ({ route, navigation }: any) => {
  const { quizId } = route.params || { quizId: "1" };
  const quiz = quizzes.find((q) => q.id === quizId) || quizzes[0];

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="relative">
          <Image
            source={{ uri: quiz.image }}
            className="w-full h-72"
            resizeMode="cover"
          />
          <TouchableOpacity
            className="absolute top-12 left-6 w-10 h-10 bg-white/80 rounded-full items-center justify-center"
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={24} color="#1F2937" />
          </TouchableOpacity>
        </View>

        <View className="px-6 -mt-10 bg-white rounded-t-[40px] pt-8 pb-10">
          <Tag
            style={{
              borderRadius: 12,
              marginBottom: 12,
              backgroundColor: "#EEF2FF",
            }}
          >
            <Text style={{ color: "#6366F1" }}>{quiz.category}</Text>
          </Tag>

          <Text className="text-3xl font-bold text-gray-900 mb-4">
            {quiz.title}
          </Text>
          <Text className="text-gray-500 text-base leading-relaxed mb-8">
            {quiz.description}
          </Text>

          <View className="flex-row flex-wrap justify-between mb-8">
            <View className="w-[30%] items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <HelpCircle size={24} color="#6366F1" className="mb-2" />
              <Text className="text-lg font-bold text-gray-900">
                {quiz.questionsCount}
              </Text>
              <Text className="text-[10px] text-gray-500 uppercase font-bold">
                Questions
              </Text>
            </View>
            <View className="w-[30%] items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <Clock size={24} color="#6366F1" className="mb-2" />
              <Text className="text-lg font-bold text-gray-900">15</Text>
              <Text className="text-[10px] text-gray-500 uppercase font-bold">
                Minutes
              </Text>
            </View>
            <View className="w-[30%] items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <Target size={24} color="#6366F1" className="mb-2" />
              <Text className="text-lg font-bold text-gray-900">80%</Text>
              <Text className="text-[10px] text-gray-500 uppercase font-bold">
                Passing
              </Text>
            </View>
          </View>

          <View className="bg-primary/5 p-6 rounded-3xl border border-primary/10 mb-8">
            <View className="flex-row items-center gap-3 mb-3">
              <ShieldCheck size={24} color="#6366F1" />
              <Text className="text-lg font-bold text-gray-900">
                Earn a Certificate
              </Text>
            </View>
            <Text className="text-gray-600 text-sm mb-4">
              Pass this quiz with a score of 80% or higher to receive a verified
              certificate of completion.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View className="px-6 py-6 border-t border-gray-100 bg-white">
        <Button
          type="primary"
          style={{ borderRadius: 16, height: 56, backgroundColor: "#6366F1" }}
          onPress={() => navigation.navigate("StartQuiz", { quizId: quiz.id })}
        >
          <Text className="text-white font-bold text-lg">
            Continue to Start
          </Text>
        </Button>
      </View>
    </View>
  );
};

export default QuizDetailScreen;
