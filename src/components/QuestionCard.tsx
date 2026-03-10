import React from "react";
import { View, Text } from "react-native";
import { Card } from "@ant-design/react-native";

interface QuestionCardProps {
  question: string;
  currentStep: number;
  totalSteps: number;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  currentStep,
  totalSteps,
}) => {
  return (
    <Card
      style={{
        borderRadius: 20,
        padding: 24,
        backgroundColor: "white",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
      }}
    >
      <View className="mb-6">
        <Text className="text-primary font-bold text-sm tracking-wider uppercase mb-2">
          Question {currentStep} of {totalSteps}
        </Text>
        <View className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
          <View
            className="h-full bg-primary rounded-full"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </View>
      </View>

      <Text className="text-xl font-bold text-gray-900 leading-tight">
        {question}
      </Text>
    </Card>
  );
};

export default QuestionCard;
