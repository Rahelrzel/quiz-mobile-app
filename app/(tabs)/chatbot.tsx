import React from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MessageSquare, Send } from "lucide-react-native";

export default function ChatbotScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="px-6 pt-6">
            <View className="flex-row items-center mb-6">
              <MessageSquare size={24} color="#0EA5E9" />
              <Text className="text-2xl font-bold text-gray-900 ml-3">
                JobPrep Assistant
              </Text>
            </View>

            <View className="bg-sky-50 rounded-2xl p-6 border border-sky-100 mb-6">
              <Text className="text-gray-700 text-base leading-6">
                Hello! I'm your JobPrep assistant. How can I help you today? You
                can ask me about available courses, quiz categories, or general
                assessment tips.
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Input Area */}
        <View className="p-6 border-t border-gray-100 flex-row items-center gap-x-4 bg-white">
          <TextInput
            placeholder="Ask something..."
            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900"
          />
          <TouchableOpacity
            className="bg-sky-500 rounded-xl p-3"
            activeOpacity={0.8}
          >
            <Send size={20} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
