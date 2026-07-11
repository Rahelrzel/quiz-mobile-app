import React, { useState } from "react";
import {
  TextInput,
  View,
  Text,
  TextInputProps,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface InputFieldProps extends TextInputProps {
  label?: string;
  placeholder: string;
  secureTextEntry?: boolean;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
}

export default function InputField({
  label,
  placeholder,
  secureTextEntry = false,
  value,
  onChangeText,
  keyboardType,
  error,
  ...rest
}: InputFieldProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPasswordField = secureTextEntry;
  const hideText = isPasswordField && !isPasswordVisible;

  return (
    <View className="mb-4">
      {label && (
        <Text className="text-gray-700 font-semibold mb-2 ml-1">{label}</Text>
      )}
      <View className="relative justify-center">
        <TextInput
          className={`border rounded-xl px-4 py-4 bg-gray-50/50 text-gray-900 text-base ${
            isPasswordField ? "pr-12" : ""
          } ${error ? "border-red-500" : "border-gray-100"}`}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          secureTextEntry={hideText}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          autoCapitalize="none"
          autoCorrect={false}
          {...rest}
        />
        {isPasswordField && (
          <TouchableOpacity
            className="absolute right-3 p-1"
            onPress={() => setIsPasswordVisible((prev) => !prev)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityRole="button"
            accessibilityLabel={
              isPasswordVisible ? "Hide password" : "Show password"
            }
          >
            <Ionicons
              name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
              size={22}
              color="#9CA3AF"
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text className="text-red-500 text-xs mt-1 ml-1">{error}</Text>}
    </View>
  );
}
