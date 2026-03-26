import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  UserCircle,
  Award,
  ChevronRight,
  Settings,
  ShieldCheck,
  LogOut,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import { authStorage } from "@/lib/authStorage";

export default function ProfileScreen() {
  const router = useRouter();

  const handleLogout = async () => {
    await authStorage.clearAuth();
    router.replace("/login");
  };
  const certificates = [
    { title: "Technology Basics", date: "Jan 12, 2026" },
    { title: "Teacher's Ethics", date: "Feb 05, 2026" },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6 pt-6">
          <View className="flex-row items-center mb-8">
            <UserCircle size={24} color="#0EA5E9" />
            <Text className="text-2xl font-bold text-gray-900 ml-3">
              My Profile
            </Text>
          </View>

          {/* Stats Section */}
          <View className="flex-row gap-x-4 mb-10">
            <View className="flex-1 bg-sky-500 rounded-2xl p-6 items-center shadow-lg shadow-sky-100">
              <Text className="text-white font-bold text-3xl">3</Text>
              <Text className="text-sky-100 text-xs mt-1 font-semibold uppercase tracking-wider">
                Quizzes
              </Text>
            </View>
            <View className="flex-1 bg-gray-900 rounded-2xl p-6 items-center shadow-lg shadow-gray-200">
              <Text className="text-white font-bold text-3xl">2</Text>
              <Text className="text-gray-400 text-xs mt-1 font-semibold uppercase tracking-wider">
                Certificates
              </Text>
            </View>
          </View>

          {/* Certificates Section */}
          <View className="mb-10">
            <View className="flex-row items-center mb-6">
              <Award size={20} color="#0EA5E9" />
              <Text className="text-lg font-bold text-gray-900 ml-3">
                My Certificates
              </Text>
            </View>

            {certificates.map((cert, index) => (
              <TouchableOpacity
                key={index}
                className="flex-row items-center bg-gray-50 border border-gray-100 rounded-2xl p-4 mb-4"
                activeOpacity={0.7}
              >
                <View className="bg-white rounded-xl p-2 mr-4 border border-gray-100 shadow-sm">
                  <ShieldCheck size={20} color="#0EA5E9" />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-900 font-bold">{cert.title}</Text>
                  <Text className="text-gray-400 text-xs mt-0.5">
                    {cert.date}
                  </Text>
                </View>
                <ChevronRight size={18} color="#94A3B8" />
              </TouchableOpacity>
            ))}
          </View>

          {/* Settings Section */}
          <View className="mb-10">
            <TouchableOpacity
              className="flex-row items-center py-5 border-b border-gray-100"
              activeOpacity={0.6}
            >
              <Settings size={20} color="#94A3B8" />
              <Text className="text-gray-700 font-semibold ml-4 flex-1">
                Account Settings
              </Text>
              <ChevronRight size={18} color="#94A3B8" />
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center py-5"
              activeOpacity={0.6}
              onPress={handleLogout}
            >
              <LogOut size={20} color="#EF4444" />
              <Text className="text-red-500 font-semibold ml-4 flex-1">
                Sign Out
              </Text>
              <ChevronRight size={18} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
