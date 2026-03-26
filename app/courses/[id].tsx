import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import YoutubePlayer from "react-native-youtube-iframe";
import { useCourseById } from "@/hooks/useCourses";

export default function CourseDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: course, isLoading, isError } = useCourseById(id);

  const getYouTubeID = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#0EA5E9" />
      </View>
    );
  }

  if (isError || !course) {
    return (
      <View className="flex-1 justify-center items-center bg-white px-6">
        <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
        <Text className="mt-4 text-xl font-bold text-gray-900 text-center">
          Unable to load course. Please try again.
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-6 bg-sky-500 px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-bold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const videoId = getYouTubeID(course.contentUrl);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Course Details",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} className="ml-4">
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView className="flex-1">
        <View className="p-6">
          <Text className="text-3xl font-bold text-gray-900 mb-4 capitalize">
            {course.title}
          </Text>
          <Text className="text-gray-500 text-lg mb-8 leading-6">
            {course.description}
          </Text>

          {videoId ? (
            <View className="rounded-2xl overflow-hidden bg-black shadow-lg">
              <YoutubePlayer height={220} videoId={videoId} />
            </View>
          ) : (
            <View className="h-40 bg-gray-100 rounded-2xl items-center justify-center border border-gray-200">
              <Text className="text-gray-400">Video not available</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
