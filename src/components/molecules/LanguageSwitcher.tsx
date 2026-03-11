import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Globe, ChevronDown } from "lucide-react-native";

const LanguageSwitcher = () => {
  return (
    <TouchableOpacity className="flex-row items-center border border-gray-200 rounded-lg px-3 py-1.5 bg-white">
      <Globe size={16} color="#4B5563" />
      <Text className="text-gray-600 font-medium mx-1.5 text-sm">English</Text>
      <ChevronDown size={14} color="#9CA3AF" />
    </TouchableOpacity>
  );
};

export default LanguageSwitcher;
