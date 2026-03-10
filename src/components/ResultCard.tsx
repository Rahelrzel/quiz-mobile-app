import React from "react";
import { View, Text } from "react-native";
import { Card, Tag } from "@ant-design/react-native";
import { Award, Target, Clock } from "lucide-react-native";

interface ResultCardProps {
  score: number;
  totalQuestions: number;
  timeSpent: string;
  isPassed: boolean;
}

const ResultCard: React.FC<ResultCardProps> = ({
  score,
  totalQuestions,
  timeSpent,
  isPassed,
}) => {
  return (
    <Card
      style={{
        borderRadius: 24,
        padding: 24,
        backgroundColor: "white",
        alignItems: "center",
      }}
    >
      <View
        className={`w-20 h-20 rounded-full items-center justify-center mb-4 ${isPassed ? "bg-green-100" : "bg-red-100"}`}
      >
        <Award size={40} color={isPassed ? "#22C55E" : "#EF4444"} />
      </View>

      <Text
        className={`text-2xl font-bold mb-1 ${isPassed ? "text-green-700" : "text-red-700"}`}
      >
        {isPassed ? "Congratulations!" : "Better Luck Next Time!"}
      </Text>
      <Text className="text-gray-500 mb-6 text-center">
        {isPassed
          ? "You have successfully passed the quiz."
          : "You did not reach the passing score this time."}
      </Text>

      <View className="flex-row w-full justify-between items-center bg-gray-50 rounded-2xl p-4">
        <View className="items-center flex-1 border-r border-gray-200">
          <Target size={20} color="#6366F1" className="mb-1" />
          <Text className="text-lg font-bold text-gray-900">
            {score}/{totalQuestions}
          </Text>
          <Text className="text-xs text-gray-500 uppercase">Score</Text>
        </View>

        <View className="items-center flex-1">
          <Clock size={20} color="#6366F1" className="mb-1" />
          <Text className="text-lg font-bold text-gray-900">{timeSpent}</Text>
          <Text className="text-xs text-gray-500 uppercase">Time</Text>
        </View>
      </View>

      <View className="mt-6">
        <Tag
          color={isPassed ? "success" : "error"}
          style={{ paddingHorizontal: 20, borderRadius: 12 }}
        >
          {isPassed ? "PASSED" : "FAILED"}
        </Tag>
      </View>
    </Card>
  );
};

export default ResultCard;
