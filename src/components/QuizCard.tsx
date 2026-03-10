import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Card, Tag, Button } from "@ant-design/react-native";
import { Clock, HelpCircle } from "lucide-react-native";

interface QuizCardProps {
  quiz: {
    id: string;
    title: string;
    description: string;
    questionsCount: number;
    difficulty: string;
    category: string;
    image: string;
  };
  onPress: () => void;
}

const QuizCard: React.FC<QuizCardProps> = ({ quiz, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} className="mb-4">
      <Card
        full
        style={{
          borderRadius: 16,
          overflow: "hidden",
          borderWidth: 0,
          elevation: 3,
        }}
      >
        <View>
          <Image
            source={{ uri: quiz.image }}
            className="w-full h-40"
            resizeMode="cover"
          />
          <View className="absolute top-3 left-3 bg-indigo-600 px-3 py-1 rounded-full">
            <Text className="text-white text-xs font-bold">
              {quiz.category}
            </Text>
          </View>
        </View>

        <View className="p-4">
          <Text className="text-xl font-bold text-gray-900 mb-2 truncate">
            {quiz.title}
          </Text>
          <Text className="text-gray-500 text-sm mb-4" numberOfLines={2}>
            {quiz.description}
          </Text>

          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-4">
              <View className="flex-row items-center gap-1">
                <HelpCircle size={16} color="#6B7280" />
                <Text className="text-gray-600 text-sm">
                  {quiz.questionsCount} Qs
                </Text>
              </View>
              <View className="flex-row items-center gap-1">
                <Clock size={16} color="#6B7280" />
                <Text className="text-gray-600 text-sm">15 min</Text>
              </View>
            </View>

            <View className="bg-gray-100 px-2 py-0.5 rounded">
              <Text className="text-gray-700 text-[10px] font-bold uppercase tracking-wider">
                {quiz.difficulty}
              </Text>
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

export default QuizCard;
