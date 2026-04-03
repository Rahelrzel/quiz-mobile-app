import React, { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Bot, Send, User } from "lucide-react-native";
import { useChat } from "@/hooks/useChat";
import { ChatMessage } from "@/api/chat";

const PRIMARY = "#db8300";
const PRIMARY_LIGHT = "#fff8eb";

export default function ChatbotScreen() {
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const scrollRef = useRef<ScrollView>(null);
  const { mutate: sendMessage, isPending } = useChat();

  const handleSend = () => {
    if (!inputText.trim() || isPending) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: inputText.trim(),
    };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInputText("");

    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);

    const history = updatedMessages.slice(-5);

    sendMessage(
      { message: userMessage.content, history },
      {
        onSuccess: (data) => {
          const reply =
            data?.reply || data?.message || data?.content || "No response.";

          if (data.success || reply !== "No response.") {
            setMessages((prev) => [
              ...prev,
              { role: "assistant", content: reply },
            ]);
          } else {
            setMessages((prev) => [
              ...prev,
              {
                role: "assistant",
                content:
                  "Sorry, the assistant is currently unavailable. Please try again.",
              },
            ]);
          }
          setTimeout(
            () => scrollRef.current?.scrollToEnd({ animated: true }),
            100,
          );
        },

        onError: () => {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content:
                "Sorry, I couldn't connect to the assistant. Please try again.",
            },
          ]);
          setTimeout(
            () => scrollRef.current?.scrollToEnd({ animated: true }),
            100,
          );
        },
      },
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        {/* Header */}
        <View className="px-6 pt-6 flex-row items-center border-b border-gray-50 pb-4">
          <Bot size={24} color={PRIMARY} />
          <Text className="text-2xl font-bold text-gray-900 ml-3">
            LearnWorlds Assistant
          </Text>
        </View>

        <ScrollView
          ref={scrollRef}
          className="flex-1 px-6"
          contentContainerStyle={{ paddingVertical: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Welcome message */}
          {messages.length === 0 && (
            <View className="flex-row justify-start mb-6">
              <View
                className="w-8 h-8 rounded-full items-center justify-center mr-2 mt-1"
                style={{ backgroundColor: PRIMARY_LIGHT }}
              >
                <Bot size={16} color={PRIMARY} />
              </View>
              <View className="p-4 rounded-2xl max-w-[80%] bg-gray-100 rounded-tl-none border border-gray-200">
                <Text className="text-base leading-6 text-gray-800">
                  Hello! I'm your LearnWorlds assistant. How can I help you
                  today? You can ask me about available courses, quiz
                  categories, or general assessment tips.
                </Text>
              </View>
            </View>
          )}

          {messages.map((msg, index) => (
            <View
              key={index}
              className={`mb-6 flex-row ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role === "assistant" && (
                <View
                  className="w-8 h-8 rounded-full items-center justify-center mr-2 mt-1"
                  style={{ backgroundColor: PRIMARY_LIGHT }}
                >
                  <Bot size={16} color={PRIMARY} />
                </View>
              )}
              <View
                className={`p-4 rounded-2xl max-w-[80%] ${
                  msg.role === "user"
                    ? "rounded-tr-none"
                    : "bg-gray-100 rounded-tl-none border border-gray-200"
                }`}
                style={msg.role === "user" ? { backgroundColor: PRIMARY } : {}}
              >
                <Text
                  className={`text-base leading-6 ${
                    msg.role === "user" ? "text-white" : "text-gray-800"
                  }`}
                >
                  {msg.content}
                </Text>
              </View>
              {msg.role === "user" && (
                <View className="w-8 h-8 rounded-full bg-gray-200 items-center justify-center ml-2 mt-1">
                  <User size={16} color="#4B5563" />
                </View>
              )}
            </View>
          ))}

          {isPending && (
            <View className="flex-row justify-start mb-6">
              <View
                className="w-8 h-8 rounded-full items-center justify-center mr-2 mt-1"
                style={{ backgroundColor: PRIMARY_LIGHT }}
              >
                <Bot size={16} color={PRIMARY} />
              </View>
              <View className="bg-gray-50 p-4 rounded-2xl rounded-tl-none border border-gray-100 flex-row items-center">
                <ActivityIndicator
                  size="small"
                  color={PRIMARY}
                  className="mr-2"
                />
                <Text className="text-gray-400 italic">Bot is typing...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input Area */}
        <View className="p-6 border-t border-gray-100 flex-row items-center gap-x-4 bg-white">
          <TextInput
            placeholder="Ask something..."
            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900"
            value={inputText}
            onChangeText={setInputText}
            multiline
            style={{ maxHeight: 100 }}
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity
            className="rounded-xl p-3"
            style={{
              backgroundColor:
                !inputText.trim() || isPending ? "#D1D5DB" : PRIMARY,
            }}
            activeOpacity={0.8}
            onPress={handleSend}
            disabled={!inputText.trim() || isPending}
          >
            <Send size={20} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
