import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { categories as mockCategories } from "@/src/data/mockQuizzes";

export default function ManageCategories() {
  const [categories, setCategories] = useState(mockCategories);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  const handleAdd = () => {
    if (!name) return;
    const newCat = {
      id: name.toLowerCase().replace(/ /g, "-"),
      title: name,
      description: desc,
      icon: "list",
      count: 0,
    };
    setCategories([...categories, newCat as any]);
    setName("");
    setDesc("");
    setShowForm(false);
  };

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
              placeholder="e.g. Science"
              className="bg-white p-4 rounded-xl mb-4 border border-gray-200"
            />
            <Text className="text-gray-900 font-bold mb-2">Description</Text>
            <TextInput
              value={desc}
              onChangeText={setDesc}
              placeholder="Describe the category"
              multiline
              numberOfLines={3}
              className="bg-white p-4 rounded-xl mb-6 border border-gray-200 h-24"
            />
            <TouchableOpacity
              onPress={handleAdd}
              className="bg-sky-500 py-4 rounded-xl items-center"
            >
              <Text className="text-white font-bold text-lg">
                Save Category
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {categories.map((cat, idx) => (
          <View
            key={idx}
            className="flex-row items-center p-4 border border-gray-100 rounded-2xl mb-4 shadow-sm bg-white"
          >
            <View className="bg-sky-50 p-3 rounded-xl mr-4">
              <Ionicons name="list" size={24} color="#0ea5e9" />
            </View>
            <View className="flex-1">
              <Text className="text-gray-900 font-bold text-lg">
                {cat.title}
              </Text>
              <Text className="text-gray-400 text-sm" numberOfLines={1}>
                {cat.description}
              </Text>
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
