import React, { FC, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import InputField from "@/src/components/atoms/InputField";

const RegisterScreen: FC = () => {
  const router = useRouter();

  // State types
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [phone, setPhone] = useState<string>("");

  // Handlers
  const handleCreateAccount = (): void => {
    console.log("Register with:", { fullName, email, password, phone });
    if (fullName && email && password) {
      router.replace("/home");
    } else {
      console.log("Registration Error: Please fill in all required fields");
    }
  };

  const handleGoogleSignUp = (): void => {
    console.log("Sign up with Google");
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="flex-row justify-between items-center px-6 py-4 border-b border-gray-100 mb-8">
            <View className="flex-row items-center">
              <View className="bg-sky-500 rounded-xl p-2 mr-2">
                <Ionicons name="school" size={24} color="white" />
              </View>
              <Text className="text-2xl font-bold text-gray-900">
                Job<Text className="text-sky-500">Prep</Text>
              </Text>
            </View>

            <TouchableOpacity className="flex-row items-center border border-gray-200 rounded-lg px-3 py-1.5">
              <Ionicons name="globe-outline" size={16} color="#4B5563" />
              <Text className="text-gray-600 font-medium mx-1.5 text-sm">
                English
              </Text>
              <Ionicons name="chevron-down" size={14} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          <View className="px-6">
            {/* Title */}
            <Text className="text-3xl font-bold text-gray-900 mb-2">
              Create Account
            </Text>
            <Text className="text-gray-400 mb-10 text-base">
              Start your journey to ace job assessments
            </Text>

            {/* Input Fields */}
            <View className="space-y-4">
              <InputField
                label="Full Name"
                placeholder="John Doe"
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
              />
              <InputField
                label="Email"
                placeholder="john@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <InputField
                label="Password"
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <InputField
                label="Phone (Optional)"
                placeholder="+1 234 567 8900"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>

            {/* Create Account Button */}
            <TouchableOpacity
              className="bg-sky-500 rounded-xl py-4 items-center shadow-lg shadow-sky-200 mt-8"
              onPress={handleCreateAccount}
              activeOpacity={0.8}
            >
              <Text className="text-white font-bold text-lg">
                Create Account
              </Text>
            </TouchableOpacity>

            {/* OR Divider */}
            <View className="flex-row items-center my-8">
              <View className="flex-1 h-px bg-gray-100" />
              <Text className="mx-4 text-gray-400 text-xs font-bold uppercase">
                OR
              </Text>
              <View className="flex-1 h-px bg-gray-100" />
            </View>

            {/* Google Sign-Up */}
            <TouchableOpacity
              className="border-2 border-sky-500 rounded-xl py-4 items-center flex-row justify-center bg-white"
              onPress={handleGoogleSignUp}
              activeOpacity={0.7}
            >
              <Ionicons name="logo-google" size={20} color="#0EA5E9" />
              <Text className="text-sky-500 font-bold text-lg ml-3">
                Continue with Google
              </Text>
            </TouchableOpacity>

            {/* Sign-in Link */}
            <View className="flex-row justify-center items-center mt-10">
              <Text className="text-gray-400 text-sm">
                Already have an account?{" "}
              </Text>
              <TouchableOpacity onPress={() => router.push("/login")}>
                <Text className="text-sky-500 font-bold text-sm">Sign in</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;
