import React, { FC } from "react";
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
import { registerSchema, RegisterFormData } from "@/validation/authSchemas";
import { useRegister } from "@/hooks/useRegister";
import { authStorage } from "@/lib/authStorage";

const PRIMARY = "#db8300";

const RegisterScreen: FC = () => {
  const router = useRouter();
  const { mutate: register, isPending } = useRegister();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    register(data, {
      onSuccess: async (response) => {
        await authStorage.setToken(response.token);
        await authStorage.setUser(response);
        router.replace("/home");
      },
      onError: (error: any) => {
        const message =
          error.message || "An error occurred during registration";
        if (message.toLowerCase().includes("email")) {
          setError("email", { message });
        } else {
          Alert.alert("Registration Failed", message);
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
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="flex-row justify-between items-center px-6 py-4 border-b border-gray-100 mb-8">
            <View className="flex-row items-center">
              <View
                className="rounded-xl p-2 mr-2"
                style={{ backgroundColor: PRIMARY }}
              >
                <Ionicons name="school" size={24} color="white" />
              </View>
              <Text className="text-2xl font-bold text-gray-900">
                LearnWorlds
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
            <Text className="text-3xl font-bold text-gray-900 mb-2">
              Create Account
            </Text>
            <Text className="text-gray-400 mb-10 text-base">
              Start your learning journey today
            </Text>

            <View className="space-y-4">
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputField
                    label="Full Name"
                    placeholder="John Doe"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    autoCapitalize="words"
                    error={errors.name?.message}
                  />
                )}
              />

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

              <Controller
                control={control}
                name="phone"
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputField
                    label="Phone (Optional)"
                    placeholder="+1 234 567 8900"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value || ""}
                    keyboardType="phone-pad"
                    error={errors.phone?.message}
                  />
                )}
              />
            </View>

            <TouchableOpacity
              className={`rounded-xl py-4 items-center shadow-lg mt-8 ${isPending ? "opacity-70" : ""}`}
              style={{ backgroundColor: PRIMARY }}
              onPress={() => handleSubmit(onSubmit)()}
              disabled={isPending}
              activeOpacity={0.8}
            >
              {isPending ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-bold text-lg">
                  Create Account
                </Text>
              )}
            </TouchableOpacity>

            <View className="flex-row justify-center items-center mt-10">
              <Text className="text-gray-400 text-sm">
                Already have an account?{" "}
              </Text>
              <TouchableOpacity onPress={() => router.push("/login")}>
                <Text className="font-bold text-sm" style={{ color: PRIMARY }}>
                  Sign in
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;
