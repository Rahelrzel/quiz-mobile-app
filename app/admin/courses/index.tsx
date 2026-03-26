import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useCourses, useCreateCourse } from "@/hooks/useCourses";

export default function ManageCourses() {
  const { data: courses, isLoading, isError } = useCourses();
  const { mutate: createCourse, isPending } = useCreateCourse();

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [contentUrl, setContentUrl] = useState("");
  const [thumbnail, setThumbnail] = useState("");

  const handleAdd = () => {
    if (!title.trim() || !contentUrl.trim()) {
      Alert.alert("Error", "Title and YouTube URL are required.");
      return;
    }

    createCourse(
      {
        title: title.trim(),
        description: description.trim(),
        contentUrl: contentUrl.trim(),
        thumbnail: thumbnail.trim(),
      },
      {
        onSuccess: () => {
          Alert.alert("Success", "Course added successfully");
          setTitle("");
          setDescription("");
          setContentUrl("");
          setThumbnail("");
          setShowForm(false);
        },
        onError: (error: any) => {
          Alert.alert(
            "Error",
            error.message || "Something went wrong while creating the item.",
          );
        },
      },
    );
  };

  const renderSkeletons = () => (
    <View>
      {[1, 2, 3, 4, 5].map((i) => (
        <View
          key={i}
          className="flex-row items-center p-4 border border-gray-100 rounded-2xl mb-4 bg-gray-50 h-24 animate-pulse"
        />
      ))}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <Stack.Screen options={{ title: "Manage Courses", headerShown: true }} />
      <ScrollView className="flex-1 px-6 pt-6">
        <View className="flex-row justify-between items-center mb-8">
          <Text className="text-2xl font-bold text-gray-900">Courses</Text>
          <TouchableOpacity
            onPress={() => setShowForm(!showForm)}
            className="bg-purple-500 p-2 rounded-full"
            disabled={isPending}
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
              editable={!isPending}
            />
            <Text className="text-gray-900 font-bold mb-2">Description</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Course description"
              multiline
              numberOfLines={3}
              className="bg-white p-4 rounded-xl mb-4 border border-gray-200 h-24"
              editable={!isPending}
            />
            <Text className="text-gray-900 font-bold mb-2">YouTube URL</Text>
            <TextInput
              value={contentUrl}
              onChangeText={setContentUrl}
              placeholder="https://youtube.com/..."
              className="bg-white p-4 rounded-xl mb-4 border border-gray-200"
              editable={!isPending}
            />
            <Text className="text-gray-900 font-bold mb-2">Thumbnail URL</Text>
            <TextInput
              value={thumbnail}
              onChangeText={setThumbnail}
              placeholder="https://image-url.com"
              className="bg-white p-4 rounded-xl mb-6 border border-gray-200"
              editable={!isPending}
            />
            <TouchableOpacity
              onPress={handleAdd}
              className={`py-4 rounded-xl items-center ${isPending ? "bg-gray-300" : "bg-purple-500"}`}
              disabled={isPending}
            >
              {isPending ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-bold text-lg">
                  Save Course
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {isLoading ? (
          renderSkeletons()
        ) : isError ? (
          <View className="py-10 items-center">
            <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
            <Text className="text-gray-500 mt-4 text-center">
              Failed to load data. Please try again.
            </Text>
          </View>
        ) : (
          courses?.map((course) => (
            <View
              key={course.id}
              className="flex-row items-center p-4 border border-gray-100 rounded-2xl mb-4 shadow-sm bg-white"
            >
              <Image
                source={{ uri: course.thumbnail }}
                className="w-16 h-16 rounded-xl mr-4 bg-gray-100"
              />
              <View className="flex-1">
                <Text
                  className="text-gray-900 font-bold text-lg leading-6"
                  numberOfLines={1}
                >
                  {course.title}
                </Text>
                <Text className="text-gray-400 text-sm" numberOfLines={2}>
                  {course.description}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
