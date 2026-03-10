import React from "react";
import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { List, Icon, Button, WhiteSpace } from "@ant-design/react-native";
import {
  Settings,
  LogOut,
  ChevronRight,
  BookOpen,
  Award,
  Target,
  User,
} from "lucide-react-native";
import { currentUser } from "../mock/users";

const ProfileScreen = ({ navigation }: any) => {
  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="bg-white px-6 pt-16 pb-12 items-center rounded-b-[40px] shadow-sm">
        <View className="relative">
          <Image
            source={{ uri: currentUser.avatar }}
            className="w-28 h-28 rounded-full border-4 border-primary/20"
          />
          <TouchableOpacity className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full items-center justify-center border-2 border-white">
            <Icon name="edit" color="white" size="xs" />
          </TouchableOpacity>
        </View>

        <Text className="text-2xl font-bold text-gray-900 mt-4">
          {currentUser.name}
        </Text>
        <Text className="text-gray-500 font-medium">{currentUser.email}</Text>

        <View className="flex-row mt-8 gap-10">
          <View className="items-center">
            <Text className="text-xl font-bold text-gray-900">12</Text>
            <Text className="text-xs text-gray-500 uppercase tracking-tighter">
              Quizzes
            </Text>
          </View>
          <View className="items-center">
            <Text className="text-xl font-bold text-gray-900">
              {currentUser.points}
            </Text>
            <Text className="text-xs text-gray-500 uppercase tracking-tighter">
              Points
            </Text>
          </View>
          <View className="items-center">
            <Text className="text-xl font-bold text-gray-900">
              {currentUser.rank}
            </Text>
            <Text className="text-xs text-gray-500 uppercase tracking-tighter">
              Rank
            </Text>
          </View>
        </View>
      </View>

      <View className="px-6 py-8">
        <Text className="text-lg font-bold text-gray-900 mb-4 px-2">
          Account Settings
        </Text>
        <List
          style={{ borderRadius: 20, overflow: "hidden", borderBottomWidth: 0 }}
        >
          <List.Item
            thumb={<User size={20} color="#6366F1" />}
            extra={<ChevronRight size={20} color="#D1D5DB" />}
            onPress={() => {}}
          >
            Personal Info
          </List.Item>
          <List.Item
            thumb={<Award size={20} color="#6366F1" />}
            extra={<ChevronRight size={20} color="#D1D5DB" />}
            onPress={() => {}}
          >
            My Certificates
          </List.Item>
          <List.Item
            thumb={<Target size={20} color="#6366F1" />}
            extra={<ChevronRight size={20} color="#D1D5DB" />}
            onPress={() => {}}
          >
            Statistics
          </List.Item>
          <List.Item
            thumb={<Settings size={20} color="#6366F1" />}
            extra={<ChevronRight size={20} color="#D1D5DB" />}
            onPress={() => {}}
          >
            Settings
          </List.Item>
        </List>

        <WhiteSpace size="xl" />

        <TouchableOpacity
          className="flex-row items-center justify-center p-4 bg-red-50 rounded-2xl border border-red-100"
          onPress={() => navigation.navigate("Login")}
        >
          <LogOut size={20} color="#EF4444" className="mr-2" />
          <Text className="text-red-500 font-bold text-lg">Log Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
