import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Button, WhiteSpace } from "@ant-design/react-native";
import { X, ArrowRight } from "lucide-react-native";
import QuestionCard from "../components/QuestionCard";
import AnswerOption from "../components/AnswerOption";
import { questions } from "../mock/questions";

const QuestionScreen = ({ route, navigation }: any) => {
  const { quizId } = route.params || { quizId: "1" };
  const quizQuestions =
    questions.filter((q) => q.quizId === quizId) || questions;

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const currentQuestion = quizQuestions[currentStep];

  const handleNext = () => {
    if (selectedOption === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }

    if (currentStep < quizQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
      setSelectedOption(null);
    } else {
      navigation.navigate("QuizResult", {
        score:
          score + (selectedOption === currentQuestion.correctAnswer ? 1 : 0),
        totalQuestions: quizQuestions.length,
        timeSpent: "02:45",
      });
    }
  };

  const handleQuit = () => {
    Alert.alert(
      "Quit Quiz",
      "Are you sure you want to quit? Your progress will be lost.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Quit",
          style: "destructive",
          onPress: () => navigation.navigate("MainTabs"),
        },
      ],
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <View className="px-6 pt-12 pb-4 flex-row items-center justify-between">
        <TouchableOpacity
          className="w-10 h-10 items-center justify-center rounded-full bg-white shadow-sm"
          onPress={handleQuit}
        >
          <X size={20} color="#374151" />
        </TouchableOpacity>

        <View className="bg-primary/10 px-4 py-1.5 rounded-full">
          <Text className="text-primary font-bold">14:20 Remaining</Text>
        </View>

        <View className="w-10" />
      </View>

      <ScrollView className="flex-1 px-6 pt-4">
        <QuestionCard
          question={currentQuestion.question}
          currentStep={currentStep + 1}
          totalSteps={quizQuestions.length}
        />

        <View className="mt-8">
          {currentQuestion.options.map((option, index) => (
            <AnswerOption
              key={index}
              option={option}
              isSelected={selectedOption === option}
              onSelect={() => setSelectedOption(option)}
            />
          ))}
        </View>
      </ScrollView>

      <View className="px-6 py-8 bg-white border-t border-gray-100">
        <Button
          type="primary"
          disabled={!selectedOption}
          style={{
            borderRadius: 16,
            height: 56,
            backgroundColor: selectedOption ? "#6366F1" : "#E5E7EB",
          }}
          onPress={handleNext}
        >
          <View className="flex-row items-center gap-2">
            <Text
              className={`font-bold text-lg ${selectedOption ? "text-white" : "text-gray-400"}`}
            >
              {currentStep === quizQuestions.length - 1
                ? "Finish Quiz"
                : "Next Question"}
            </Text>
            {selectedOption && <ArrowRight size={20} color="white" />}
          </View>
        </Button>
      </View>
    </View>
  );
};

export default QuestionScreen;
