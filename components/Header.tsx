import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Menu, LogOut, User } from "lucide-react-native";
import { useRouter } from "expo-router";
import LanguageSwitcher from "./LanguageSwitcher";

const Header = ({ userName = "Rich" }) => {
  const router = useRouter();

  const handleLogout = () => {
    // Mock logout
    console.log("Logging out...");
    router.replace("/login");
  };

  return (
    <View className="bg-white border-b border-gray-100 px-6 py-4 flex-row justify-between items-center">
      {/* Logo Section */}
      <View className="flex-row items-center">
        <View className="bg-sky-500 rounded-xl p-1.5 mr-2">
          <Ionicons name="school" size={20} color="white" />
        </View>
        <Text className="text-lg font-bold text-gray-900">
          Job<Text className="text-sky-500">Prep</Text>
        </Text>
      </View>

      {/* Right Section */}
      <View className="flex-row items-center gap-x-4">
        <View className="hidden md:flex">
          <LanguageSwitcher />
        </View>

        <View className="flex-row items-center">
          <Text className="text-gray-500 text-xs mr-2">
            Welcome, {userName}
          </Text>
          <TouchableOpacity
            onPress={handleLogout}
            className="flex-row items-center border border-sky-500 rounded-lg px-3 py-1.5 bg-white"
          >
            <LogOut size={16} color="#0EA5E9" />
            <Text className="text-sky-500 font-bold ml-2 text-sm">Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Header;
