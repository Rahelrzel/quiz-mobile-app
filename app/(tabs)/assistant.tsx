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
import { MessageSquare, Send } from "lucide-react-native";
import { useChat } from "@/hooks/useChat";
import { ChatMessage } from "@/api/chat";

export default function ChatbotScreen() {
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm your JobPrep assistant. How can I help you today? You can ask me about available courses, quiz categories, or general assessment tips.",
    },
  ]);

  const scrollRef = useRef<ScrollView>(null);
  const { mutate: sendMessage, isPending } = useChat();

  const handleSend = () => {
    if (!inputText.trim() || isPending) return;

    console.log("Chatbot: Sending message...");

    const userMessage: ChatMessage = {
      role: "user",
      content: inputText.trim(),
    };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInputText("");

    // Auto-scroll to bottom
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);

    sendMessage(
      { message: userMessage.content, history: updatedMessages },
      {
        onSuccess: (data) => {
          if (data.success) {
            setMessages((prev) => [
              ...prev,
              { role: "assistant", content: data.reply },
            ]);
          } else {
            setMessages((prev) => [
              ...prev,
              {
                role: "assistant",
                content:
                  "Sorry, I couldn't connect to the assistant. Please try again.",
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
        <View className="px-6 pt-6 flex-row items-center border-b border-gray-50 pb-4">
          <MessageSquare size={24} color="#0EA5E9" />
          <Text className="text-2xl font-bold text-gray-900 ml-3">
            JobPrep Assistant
          </Text>
        </View>

        <ScrollView
          ref={scrollRef}
          className="flex-1 px-6"
          contentContainerStyle={{ paddingVertical: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg, index) => (
            <View
              key={index}
              className={`mb-6 max-w-[85%] ${
                msg.role === "user" ? "self-end" : "self-start"
              }`}
            >
              <View
                className={`p-4 rounded-2xl ${
                  msg.role === "user"
                    ? "bg-sky-500 rounded-tr-none"
                    : "bg-gray-100 rounded-tl-none border border-gray-200"
                }`}
              >
                <Text
                  className={`text-base leading-6 ${
                    msg.role === "user" ? "text-white" : "text-gray-800"
                  }`}
                >
                  {msg.content}
                </Text>
              </View>
            </View>
          ))}

          {isPending && (
            <View className="self-start bg-gray-50 p-4 rounded-2xl rounded-tl-none border border-gray-100 mb-6 flex-row items-center">
              <ActivityIndicator
                size="small"
                color="#0EA5E9"
                className="mr-2"
              />
              <Text className="text-gray-400 italic">Bot is typing...</Text>
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
            className={`rounded-xl p-3 ${
              !inputText.trim() || isPending ? "bg-gray-300" : "bg-sky-500"
            }`}
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
