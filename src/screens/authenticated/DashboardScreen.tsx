import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { SearchBar, Icon, Grid } from "@ant-design/react-native";
import {
  GraduationCap,
  Award,
  BookOpen,
  FileQuestion,
} from "lucide-react-native";
import QuizCard from "../components/QuizCard";
import { quizzes } from "../mock/quizzes";
import { currentUser } from "../mock/users";

const DashboardScreen = ({ navigation }: any) => {
  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      showsVerticalScrollIndicator={false}
    >
      {/* Header Profile Section */}
      <View className="bg-primary px-6 pt-12 pb-10 rounded-b-[40px] shadow-lg">
        <View className="flex-row items-center justify-between mb-6">
          <View>
            <Text className="text-white/80 text-lg">Hello,</Text>
            <Text className="text-white text-2xl font-bold">
              {currentUser.name}
            </Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
            <Image
              source={{ uri: currentUser.avatar }}
              className="w-12 h-12 rounded-full border-2 border-white/50"
            />
          </TouchableOpacity>
        </View>

        <View className="flex-row gap-4">
          <View className="flex-1 bg-white/10 rounded-2xl p-4 border border-white/20">
            <Award size={24} color="white" />
            <Text className="text-white font-bold text-lg mt-1">
              {currentUser.points}
            </Text>
            <Text className="text-white/70 text-xs uppercase tracking-tighter">
              Total Points
            </Text>
          </View>
          <View className="flex-1 bg-white/10 rounded-2xl p-4 border border-white/20">
            <GraduationCap size={24} color="white" />
            <Text className="text-white font-bold text-lg mt-1">
              # {currentUser.rank}
            </Text>
            <Text className="text-white/70 text-xs uppercase tracking-tighter">
              Global Rank
            </Text>
          </View>
        </View>
      </View>

      <View className="px-6 -mt-6">
        <View className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2">
          <SearchBar
            placeholder="Search your favorite quiz..."
            showCancelButton={false}
            style={{ height: 40, borderBottomWidth: 0 }}
          />
        </View>
      </View>

      <View className="px-6 py-8">
        <View className="flex-row items-center justify-between mb-6">
          <View className="flex-row items-center gap-2">
            <BookOpen size={24} color="#6366F1" />
            <Text className="text-xl font-bold text-gray-900">Recommended</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("QuizList")}>
            <Text className="text-primary font-semibold">View All</Text>
          </TouchableOpacity>
        </View>

        {quizzes.slice(0, 2).map((quiz) => (
          <QuizCard
            key={quiz.id}
            quiz={quiz}
            onPress={() =>
              navigation.navigate("QuizDetail", { quizId: quiz.id })
            }
          />
        ))}

        <View className="mt-8">
          <View className="flex-row items-center gap-2 mb-6">
            <FileQuestion size={24} color="#6366F1" />
            <Text className="text-xl font-bold text-gray-900">Categories</Text>
          </View>

          <View className="flex-row flex-wrap justify-between">
            {["Programming", "Science", "History", "Math"].map((cat, index) => (
              <TouchableOpacity
                key={index}
                className="w-[48%] bg-white p-4 rounded-2xl mb-4 border border-gray-100 shadow-sm items-center"
              >
                <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center mb-2">
                  <Icon name="appstore" color="#6366F1" />
                </View>
                <Text className="font-bold text-gray-800">{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default DashboardScreen;
