import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

export const PriceShimmer: React.FC = () => {
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 900 }), -1, true);
  }, [opacity]);

  const shimmerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View className="items-center mb-6">
      <Animated.View
        style={shimmerStyle}
        className="w-28 h-4 bg-gray-200 rounded mb-2"
      />
      <Animated.View
        style={shimmerStyle}
        className="w-24 h-10 bg-gray-200 rounded-lg mb-1"
      />
      <Animated.View
        style={shimmerStyle}
        className="w-40 h-3 bg-gray-100 rounded"
      />
    </View>
  );
};
