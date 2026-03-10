import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Check, Circle } from "lucide-react-native";

interface AnswerOptionProps {
  option: string;
  isSelected: boolean;
  isCorrect?: boolean;
  isWrong?: boolean;
  onSelect: () => void;
  disabled?: boolean;
}

const AnswerOption: React.FC<AnswerOptionProps> = ({
  option,
  isSelected,
  isCorrect,
  isWrong,
  onSelect,
  disabled,
}) => {
  let borderColor = "border-gray-200";
  let bgColor = "bg-white";
  let textColor = "text-gray-700";

  if (isCorrect) {
    borderColor = "border-green-500";
    bgColor = "bg-green-50";
    textColor = "text-green-700";
  } else if (isWrong && isSelected) {
    borderColor = "border-red-500";
    bgColor = "bg-red-50";
    textColor = "text-red-700";
  } else if (isSelected) {
    borderColor = "border-primary";
    bgColor = "bg-primary/10";
    textColor = "text-primary";
  }

  return (
    <TouchableOpacity
      onPress={onSelect}
      disabled={disabled}
      activeOpacity={0.7}
      className={`flex-row items-center p-4 mb-3 border-2 rounded-xl ${borderColor} ${bgColor}`}
    >
      <View className="mr-3">
        {isSelected ? (
          <Check
            size={20}
            color={isCorrect ? "#22C55E" : isWrong ? "#EF4444" : "#6366F1"}
          />
        ) : (
          <Circle size={20} color="#D1D5DB" />
        )}
      </View>
      <Text className={`flex-1 text-base font-semibold ${textColor}`}>
        {option}
      </Text>
    </TouchableOpacity>
  );
};

export default AnswerOption;
