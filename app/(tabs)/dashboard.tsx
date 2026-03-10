import React from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LayoutGrid, BookOpen } from "lucide-react-native";
import QuizCategoryCard from "@/components/QuizCategoryCard";
import CourseCard from "@/components/CourseCard";

export default function DashboardScreen() {
  const categories = [
    { title: "Technology Quizzes", count: 1 },
    { title: "teacher Quizzes", count: 1 },
    { title: "reception Quizzes", count: 0 },
    { title: "test3 Quizzes", count: 1 },
  ];

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
  ];

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6 pt-6">
          {/* Practice Quizzes Section */}
          <View className="mb-10">
            <View className="flex-row items-center mb-6">
              <LayoutGrid size={24} color="#0EA5E9" />
              <Text className="text-2xl font-bold text-gray-900 ml-3">
                Practice Quizzes
              </Text>
            </View>

            {categories.map((category, index) => (
              <QuizCategoryCard
                key={index}
                title={category.title}
                quizCount={category.count}
                onPress={() =>
                  console.log(`Selected category: ${category.title}`)
                }
              />
            ))}
          </View>

          {/* Available Courses Section */}
          <View className="mb-6">
            <View className="flex-row items-center mb-6">
              <BookOpen size={24} color="#0EA5E9" />
              <Text className="text-2xl font-bold text-gray-900 ml-3">
                Available Courses
              </Text>
            </View>

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
