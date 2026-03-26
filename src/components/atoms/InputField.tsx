import React from "react";
import { TextInput, View, Text, TextInputProps } from "react-native";

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
  return (
    <View className="mb-4">
      {label && (
        <Text className="text-gray-700 font-semibold mb-2 ml-1">{label}</Text>
      )}
      <TextInput
        className={`border rounded-xl px-4 py-4 bg-gray-50/50 text-gray-900 text-base ${
          error ? "border-red-500" : "border-gray-100"
        }`}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        secureTextEntry={secureTextEntry}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCapitalize="none"
        autoCorrect={false}
        {...rest}
      />
      {error && <Text className="text-red-500 text-xs mt-1 ml-1">{error}</Text>}
    </View>
  );
}
