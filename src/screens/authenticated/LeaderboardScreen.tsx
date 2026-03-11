import React from "react";
import { View, Text, ScrollView, Image } from "react-native";
import { List, Tag } from "@ant-design/react-native";
import { Trophy, Medal, Award } from "lucide-react-native";
import { users } from "../mock/users";

const LeaderboardScreen = () => {
  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-primary px-6 pt-16 pb-12 rounded-b-[40px] items-center">
        <Trophy size={48} color="white" className="mb-4" />
        <Text className="text-white text-3xl font-bold">Leaderboard</Text>
        <Text className="text-white/70 text-base mt-1">
          Check your rank among the best
        </Text>
      </View>

      <ScrollView className="flex-1 px-6 -mt-8">
        <View className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {users.map((user, index) => (
            <View
              key={user.id}
              className={`flex-row items-center p-4 border-b border-gray-50 ${index === 0 ? "bg-amber-50/30" : ""}`}
            >
              <View className="w-8 items-center justify-center mr-3">
                {index === 0 ? (
                  <Medal size={24} color="#D97706" />
                ) : index === 1 ? (
                  <Medal size={24} color="#94A3B8" />
                ) : index === 2 ? (
                  <Medal size={24} color="#B45309" />
                ) : (
                  <Text className="text-gray-400 font-bold">{index + 1}</Text>
                )}
              </View>

              <Image
                source={{ uri: user.avatar }}
                className="w-12 h-12 rounded-full mr-4 border-2 border-white shadow-sm"
              />

              <View className="flex-1">
                <Text className="text-gray-900 font-bold text-base">
                  {user.name}
                </Text>
                <Tag
                  style={{
                    alignSelf: "flex-start",
                    height: 18,
                    paddingHorizontal: 4,
                  }}
                >
                  <Text className="text-[10px] text-gray-500 uppercase">
                    {user.points} pts
                  </Text>
                </Tag>
              </View>

              <View className="items-end">
                <Text className="text-primary font-bold text-lg">
                  {user.points}
                </Text>
                <Text className="text-gray-400 text-[10px] uppercase">
                  SCORE
                </Text>
              </View>
            </View>
          ))}
        </View>
        <View className="h-10" />
      </ScrollView>
    </View>
  );
};

export default LeaderboardScreen;
