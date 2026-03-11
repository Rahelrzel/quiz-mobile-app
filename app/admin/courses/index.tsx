import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function ManageCourses() {
  const [courses, setCourses] = useState([
    {
      title: "React Native Masterclass",
      instructor: "Rich Tech",
      image:
        "https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?q=80&w=1000&auto=format&fit=crop",
    },
    {
      title: "UI/UX Design Fundamentals",
      instructor: "Sara Design",
      image:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000&auto=format&fit=crop",
    },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [instructor, setInstructor] = useState("");

  const handleAdd = () => {
    if (!title) return;
    setCourses([
      ...courses,
      {
        title,
        instructor,
        image:
          "https://images.unsplash.com/photo-1454165833767-027ffea9e53b?q=80&w=1000&auto=format&fit=crop",
      },
    ]);
    setTitle("");
    setInstructor("");
    setShowForm(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <Stack.Screen options={{ title: "Manage Courses", headerShown: true }} />
      <ScrollView className="flex-1 px-6 pt-6">
        <View className="flex-row justify-between items-center mb-8">
          <Text className="text-2xl font-bold text-gray-900">Courses</Text>
          <TouchableOpacity
            onPress={() => setShowForm(!showForm)}
            className="bg-purple-500 p-2 rounded-full"
          >
            <Ionicons
              name={showForm ? "close" : "add"}
              size={32}
              color="white"
            />
          </TouchableOpacity>
        </View>

        {showForm && (
          <View className="bg-gray-50 p-6 rounded-3xl mb-8 border border-gray-100">
            <Text className="text-gray-900 font-bold mb-2">Course Title</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Next.js Mastery"
              className="bg-white p-4 rounded-xl mb-4 border border-gray-200"
            />
            <Text className="text-gray-900 font-bold mb-2">
              Instructor Name
            </Text>
            <TextInput
              value={instructor}
              onChangeText={setInstructor}
              placeholder="e.g. John Doe"
              className="bg-white p-4 rounded-xl mb-6 border border-gray-200"
            />
            <TouchableOpacity
              onPress={handleAdd}
              className="bg-purple-500 py-4 rounded-xl items-center"
            >
              <Text className="text-white font-bold text-lg">Save Course</Text>
            </TouchableOpacity>
          </View>
        )}

        {courses.map((course, idx) => (
          <View
            key={idx}
            className="flex-row items-center p-4 border border-gray-100 rounded-2xl mb-4 shadow-sm bg-white"
          >
            <Image
              source={{ uri: course.image }}
              className="w-16 h-16 rounded-xl mr-4"
            />
            <View className="flex-1">
              <Text className="text-gray-900 font-bold text-lg leading-6">
                {course.title}
              </Text>
              <Text className="text-gray-400 text-sm">{course.instructor}</Text>
            </View>
            <TouchableOpacity className="p-2">
              <Ionicons name="trash-outline" size={20} color="#ef4444" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
