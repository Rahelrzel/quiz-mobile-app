import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import {
  LayoutGrid,
  BookOpen,
  HelpCircle,
  List,
  ExternalLink,
  ChevronRight,
} from "lucide-react-native";
import { authStorage } from "@/lib/authStorage";

export default function AdminDashboard() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      const user = await authStorage.getUser();
      if (user?.role === "admin") {
        setIsAdmin(true);
      } else {
        router.replace("/home");
      }
    };
    checkAdmin();
  }, []);

  if (isAdmin === null) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#db8300" />
      </View>
    );
  }

  const adminModules = [
    {
      title: "Manage Categories",
      icon: List,
      route: "/admin/categories",
      color: "#0284c7",
    },
    {
      title: "Manage Courses",
      icon: BookOpen,
      route: "/admin/courses",
      color: "#7c3aed",
    },
    {
      title: "Manage Quizzes",
      icon: LayoutGrid,
      route: "/admin/quizzes",
      color: "#059669",
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Admin Dashboard",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "#f9fafb" },
        }}
      />
      <ScrollView className="flex-1 px-6 pt-6">
        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-900">
            Control Center
          </Text>
          <Text className="text-gray-500 mt-1">
            Manage your application content
          </Text>
        </View>

        <View className="flex-row flex-wrap justify-between">
          {adminModules.map((module, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => router.push(module.route as any)}
              className="w-[48%] bg-white p-6 rounded-3xl mb-4 shadow-sm border border-gray-100"
              activeOpacity={0.7}
            >
              <View
                className="w-12 h-12 rounded-2xl items-center justify-center mb-4"
                style={{ backgroundColor: module.color + "15" }}
              >
                <module.icon size={24} color={module.color} />
              </View>
              <Text className="text-gray-900 font-bold text-lg leading-6">
                {module.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          onPress={() => router.replace("/home")}
          className="bg-white p-6 rounded-3xl mt-4 flex-row items-center border mb-10 shadow-sm"
          style={{ borderColor: "#ffd980" }}
          activeOpacity={0.7}
        >
          <View
            className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
            style={{ backgroundColor: "#fff8eb" }}
          >
            <ExternalLink size={24} color="#db8300" />
          </View>
          <View className="flex-1">
            <Text className="text-gray-900 font-bold text-lg">
              Preview User App
            </Text>
            <Text className="text-gray-500 text-sm">
              Switch to student view
            </Text>
          </View>
          <ChevronRight size={20} color="#94a3b8" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
