import React from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BookOpen } from "lucide-react-native";
import CourseCard from "@/src/components/molecules/CourseCard";

export default function CoursesScreen() {
  const courses = [
    {
      title: "teachers",
      description: "this is for teachers lesson",
      image:
        "https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?q=80&w=1000&auto=format&fit=crop",
    },
    {
      title: "reception",
      description: "this is course",
      image:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000&auto=format&fit=crop",
    },
    {
      title: "test 3",
      description: "this is test 3",
      image:
        "https://images.unsplash.com/photo-1454165833767-027ffea9e53b?q=80&w=1000&auto=format&fit=crop",
    },
  ];

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
            {courses.map((course, index) => (
              <CourseCard
                key={index}
                title={course.title}
                description={course.description}
                image={course.image}
                onPress={() => console.log(`Selected course: ${course.title}`)}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
