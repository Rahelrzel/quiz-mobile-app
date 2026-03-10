import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import {
  LayoutGrid,
  BookOpen,
  MessageSquare,
  UserCircle,
} from "lucide-react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#0EA5E9",
        tabBarInactiveTintColor: "#94A3B8",
        tabBarStyle: Platform.select({
          ios: {
            height: 90,
            paddingBottom: 30,
            borderTopWidth: 1,
            borderTopColor: "#F1F5F9",
          },
          default: {
            height: 70,
            paddingBottom: 15,
            borderTopWidth: 1,
            borderTopColor: "#F1F5F9",
          },
        }),
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginBottom: 4,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Quiz",
          tabBarIcon: ({ color }) => <LayoutGrid size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="courses"
        options={{
          title: "Courses",
          tabBarIcon: ({ color }) => <BookOpen size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="chatbot"
        options={{
          title: "Assistant",
          tabBarIcon: ({ color }) => <MessageSquare size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <UserCircle size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
