import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { FileText, ChevronRight } from "lucide-react-native";

const PRIMARY = "#db8300";
const PRIMARY_LIGHT = "#fff8eb";

interface QuizCategoryCardProps {
  title: string;
  quizCount: number;
  onPress?: () => void;
}

const QuizCategoryCard: React.FC<QuizCategoryCardProps> = ({
  title,
  quizCount,
  onPress,
}) => {
  return (
    <View className="bg-white rounded-2xl border border-gray-100 p-6 mb-4 shadow-sm">
      <View className="flex-row items-center mb-4">
        <View
          className="rounded-xl p-3 mr-4"
          style={{ backgroundColor: PRIMARY_LIGHT }}
        >
          <FileText size={24} color={PRIMARY} />
        </View>
        <View className="flex-1">
          <Text className="text-gray-900 font-bold text-lg">{title}</Text>
          <Text className="text-gray-400 text-sm">
            {quizCount} {quizCount === 1 ? "quiz" : "quizzes"} available
          </Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={onPress}
        className="rounded-xl py-3 items-center flex-row justify-center"
        style={{ backgroundColor: PRIMARY }}
        activeOpacity={0.8}
      >
        <Text className="text-white font-bold mr-2">View Quizzes</Text>
        <ChevronRight size={18} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default QuizCategoryCard;
