import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import InputField from "@/src/components/atoms/InputField";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "@/validation/authSchemas";
import { useLogin } from "@/hooks/useLogin";
import { authStorage } from "@/lib/authStorage";

export default function LoginScreen() {
  const router = useRouter();
  const { mutate: login, isPending } = useLogin();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormData) => {
    console.log("Login onSubmit triggered with data:", data);
    login(data, {
      onSuccess: async (response) => {
        await authStorage.setToken(response.token);
        await authStorage.setUser(response);
        console.log("Login success:", response);
        if (response.role === "admin") {
          router.replace("/admin");
        } else {
          router.replace("/home");
        }
      },
      onError: (error: any) => {
        const message = error.message || "Invalid email or password";
        if (message.toLowerCase().includes("email")) {
          setError("email", { message });
        } else if (message.toLowerCase().includes("password")) {
          setError("password", { message });
        } else {
          Alert.alert("Login Failed", message);
        }
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header Bar */}
          <View className="flex-row justify-between items-center px-6 py-4 border-b border-gray-100">
            <View className="flex-row items-center">
              <View className="bg-sky-500 rounded-xl p-2 mr-2">
                <Ionicons name="school" size={24} color="white" />
              </View>
              <Text className="text-xl font-bold text-gray-900">
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

          <View className="flex-1 justify-center px-6 py-10">
            <Text className="text-3xl font-bold text-gray-900 mb-2">
              Sign In
            </Text>
            <Text className="text-gray-400 mb-8 text-base">
              Welcome back! Sign in to continue your journey.
            </Text>

            <View className="space-y-4">
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputField
                    label="Email"
                    placeholder="john@example.com"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    error={errors.email?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputField
                    label="Password"
                    placeholder="••••••••"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    secureTextEntry
                    error={errors.password?.message}
                  />
                )}
              />
            </View>

            <TouchableOpacity className="items-end mb-8">
              <Text className="text-sky-500 font-semibold text-sm">
                Forgot password?
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`bg-sky-500 rounded-xl py-4 items-center shadow-lg shadow-sky-200 ${
                isPending ? "opacity-70" : ""
              }`}
              onPress={() => {
                console.log("Login button pressed");
                handleSubmit(onSubmit)();
              }}
              disabled={isPending}
              activeOpacity={0.8}
            >
              {isPending ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-bold text-lg">Sign In</Text>
              )}
            </TouchableOpacity>

            <View className="flex-row justify-center items-center pb-6">
              <Text className="text-gray-400 text-sm">
                Don't have an account?{" "}
              </Text>
              <TouchableOpacity onPress={() => router.push("/register")}>
                <Text className="text-sky-500 font-bold text-sm">
                  Create one
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
