import React from "react";
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
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "@/src/components/atoms/InputField";
import {
  ChangePasswordFormData,
  changePasswordSchema,
} from "@/validation/authSchemas";
import { changeUserPassword } from "@/services/userService";

const PRIMARY = "#db8300";

export default function ChangePasswordScreen() {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmit = async (values: ChangePasswordFormData) => {
    try {
      await changeUserPassword(values);
      Alert.alert("Success", "Password changed successfully.");
      reset();
      router.back();
    } catch (error: any) {
      Alert.alert("Error", error?.message || "Failed to change password.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
          <View className="flex-row items-center mb-6">
            <TouchableOpacity onPress={() => router.back()} className="mr-3">
              <Ionicons name="arrow-back" size={22} color="#111827" />
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-gray-900">
              Change Password
            </Text>
          </View>

          <Controller
            control={control}
            name="currentPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <InputField
                label="Current Password"
                placeholder="Current password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                secureTextEntry
                error={errors.currentPassword?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="newPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <InputField
                label="New Password"
                placeholder="New password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                secureTextEntry
                error={errors.newPassword?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="confirmNewPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <InputField
                label="Confirm New Password"
                placeholder="Confirm new password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                secureTextEntry
                error={errors.confirmNewPassword?.message}
              />
            )}
          />

          <TouchableOpacity
            className={`rounded-xl py-4 items-center mt-4 ${isSubmitting ? "opacity-70" : ""}`}
            style={{ backgroundColor: PRIMARY }}
            onPress={() => handleSubmit(onSubmit)()}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-lg">Update Password</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
