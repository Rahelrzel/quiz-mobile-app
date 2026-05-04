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
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "@/src/components/atoms/InputField";
import {
  EditProfileFormData,
  editProfileSchema,
} from "@/validation/authSchemas";
import { getUserProfile, updateUserProfile } from "@/services/userService";

const PRIMARY = "#db8300";

export default function EditProfileScreen() {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: "",
      phone: "",
    },
  });

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getUserProfile();
        setValue("name", data.name || "");
        setValue("phone", data.phone || "");
      } catch {
        Alert.alert("Error", "Failed to load profile details.");
      }
    };
    load();
  }, [setValue]);

  const onSubmit = async (values: EditProfileFormData) => {
    try {
      await updateUserProfile(values);
      Alert.alert("Success", "Profile updated successfully.");
      router.back();
    } catch (error: any) {
      Alert.alert("Error", error?.message || "Failed to update profile.");
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
            <Text className="text-2xl font-bold text-gray-900">Edit Profile</Text>
          </View>

          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <InputField
                label="Name"
                placeholder="Your name"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, onBlur, value } }) => (
              <InputField
                label="Phone"
                placeholder="Your phone number"
                value={value || ""}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="phone-pad"
                error={errors.phone?.message}
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
              <Text className="text-white font-bold text-lg">Save Changes</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
