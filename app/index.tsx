import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");
const PRIMARY = "#db8300";

export default function WelcomeScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
      <StatusBar style="dark" />

      {/* Amber Gradient Background */}
      <LinearGradient
        colors={["#fff8eb", "#ffedc2", "#ffd980"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="absolute inset-0"
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          className="flex-1 px-6 justify-center"
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {/* Logo and Title */}
          <View className="items-center mb-16">
            <View
              className="w-24 h-24 rounded-full items-center justify-center shadow-lg mb-6"
              style={{ backgroundColor: PRIMARY }}
            >
              <Ionicons name="school" size={48} color="white" />
            </View>
            <Text className="text-5xl font-bold text-center text-gray-900">
              LearnWorlds
            </Text>
            <Text className="text-gray-600 text-lg text-center mt-3 px-4">
              Master new skills with interactive quizzes
            </Text>
          </View>

          {/* Feature Highlights */}
          <View className="flex-row justify-between mb-12 px-2">
            <View className="items-center flex-1">
              <Ionicons name="document-text" size={28} color={PRIMARY} />
              <Text className="text-gray-700 font-semibold mt-2">Quizzes</Text>
            </View>
            <View className="items-center flex-1">
              <Ionicons name="people" size={28} color={PRIMARY} />
              <Text className="text-gray-700 font-semibold mt-2">Courses</Text>
            </View>
            <View className="items-center flex-1">
              <Ionicons name="stats-chart" size={28} color={PRIMARY} />
              <Text className="text-gray-700 font-semibold mt-2">
                Certificates
              </Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Buttons at Bottom */}
      <View className="px-6 pb-8 pt-4 bg-white/95 rounded-t-3xl shadow-lg">
        <TouchableOpacity
          activeOpacity={0.9}
          className="h-14 rounded-xl flex-row items-center justify-center shadow-md mb-3"
          style={{ backgroundColor: PRIMARY }}
          onPress={() => router.push("/login")}
        >
          <Ionicons name="log-in-outline" size={20} color="white" />
          <Text className="text-white font-bold text-lg ml-2">Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          className="bg-white h-14 rounded-xl flex-row items-center justify-center border-2"
          style={{ borderColor: PRIMARY }}
          onPress={() => router.push("/register")}
        >
          <Ionicons name="person-add-outline" size={20} color={PRIMARY} />
          <Text className="font-bold text-lg ml-2" style={{ color: PRIMARY }}>
            Create Account
          </Text>
        </TouchableOpacity>

        <Text className="text-center text-gray-400 text-xs mt-4">
          Secure learning platform
        </Text>
      </View>
    </SafeAreaView>
  );
}
