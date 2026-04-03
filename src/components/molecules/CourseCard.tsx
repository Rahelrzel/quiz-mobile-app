import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { BookOpen } from "lucide-react-native";

const PRIMARY = "#db8300";

interface CourseCardProps {
  title: string;
  description: string;
  image?: string;
  onPress?: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({
  title,
  description,
  image,
  onPress,
}) => {
  return (
    <View className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-6 shadow-sm">
      <View className="h-40 bg-gray-200">
        <Image
          source={{
            uri:
              image ||
              "https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?q=80&w=1000&auto=format&fit=crop",
          }}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>

      <View className="p-5">
        <Text className="text-gray-900 font-bold text-lg mb-2 capitalize">
          {title}
        </Text>
        <Text className="text-gray-500 text-sm mb-5 leading-5">
          {description}
        </Text>

        <TouchableOpacity
          onPress={onPress}
          className="rounded-xl py-3 items-center flex-row justify-center border"
          style={{ borderColor: PRIMARY }}
          activeOpacity={0.7}
        >
          <BookOpen size={18} color={PRIMARY} />
          <Text className="font-bold ml-2" style={{ color: PRIMARY }}>
            View Course
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CourseCard;
