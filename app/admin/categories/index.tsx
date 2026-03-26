import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useCategories, useCreateCategory } from "@/hooks/useQuizzes";

export default function ManageCategories() {
  const { data: categories, isLoading, isError } = useCategories();
  const { mutate: createCategory, isPending } = useCreateCategory();

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  const handleAdd = () => {
    if (!name.trim()) {
      Alert.alert("Error", "Category name is required.");
      return;
    }

    createCategory(
      { name: name.trim(), description: desc.trim() },
      {
        onSuccess: () => {
          Alert.alert("Success", "Category created successfully");
          setName("");
          setDesc("");
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
          className="flex-row items-center p-4 border border-gray-100 rounded-2xl mb-4 bg-gray-50 h-20 animate-pulse"
        />
      ))}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <Stack.Screen
        options={{ title: "Manage Categories", headerShown: true }}
      />
      <ScrollView className="flex-1 px-6 pt-6">
        <View className="flex-row justify-between items-center mb-8">
          <Text className="text-2xl font-bold text-gray-900">Categories</Text>
          <TouchableOpacity
            onPress={() => setShowForm(!showForm)}
            className="bg-sky-500 p-2 rounded-full"
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
            <Text className="text-gray-900 font-bold mb-2">Category Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="e.g. Technology"
              className="bg-white p-4 rounded-xl mb-4 border border-gray-200"
              editable={!isPending}
            />
            <Text className="text-gray-900 font-bold mb-2">Description</Text>
            <TextInput
              value={desc}
              onChangeText={setDesc}
              placeholder="Technology related quizzes"
              multiline
              numberOfLines={3}
              className="bg-white p-4 rounded-xl mb-6 border border-gray-200 h-24"
              editable={!isPending}
            />
            <TouchableOpacity
              onPress={handleAdd}
              className={`py-4 rounded-xl items-center ${isPending ? "bg-gray-300" : "bg-sky-500"}`}
              disabled={isPending}
            >
              {isPending ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-bold text-lg">
                  Save Category
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
          categories?.map((cat) => (
            <View
              key={cat.id}
              className="flex-row items-center p-4 border border-gray-100 rounded-2xl mb-4 shadow-sm bg-white"
            >
              <View className="bg-sky-50 p-3 rounded-xl mr-4">
                <Ionicons name="list" size={24} color="#0ea5e9" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-bold text-lg">
                  {cat.name}
                </Text>
                <Text className="text-gray-400 text-sm" numberOfLines={1}>
                  {cat.description}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
