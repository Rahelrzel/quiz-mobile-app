import React from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BookOpen, AlertCircle } from "lucide-react-native";
import { useRouter } from "expo-router";
import CourseCard from "@/src/components/molecules/CourseCard";
import { useCourses } from "@/hooks/useCourses";

export default function CoursesScreen() {
  const router = useRouter();
  const { data: courses, isLoading, isError } = useCourses();

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#0EA5E9" />
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 justify-center items-center bg-white px-6">
        <AlertCircle size={64} color="#EF4444" />
        <Text className="mt-4 text-xl font-bold text-gray-900 text-center">
          Unable to load courses. Please try again.
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6 pt-6">
          <View className="flex-row items-center mb-6">
            <BookOpen size={24} color="#0EA5E9" />
            <Text className="text-2xl font-bold text-gray-900 ml-3">
              Available Courses
            </Text>
          </View>

          <Text className="text-gray-400 mb-8 -mt-4">
            Browse courses and learn new skills
          </Text>

          <View className="space-y-4">
            {courses?.map((course) => (
              <CourseCard
                key={course.id}
                title={course.title}
                description={course.description}
                image={course.thumbnail}
                onPress={() => router.push(`/courses/${course.id}` as any)}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
