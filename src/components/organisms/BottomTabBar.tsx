import React from "react";
import { View, TouchableOpacity, Text, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  LayoutGrid,
  BookOpen,
  MessageSquare,
  UserCircle,
} from "lucide-react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";

export function BottomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  const tabs = [
    { name: "home", label: "Home", icon: LayoutGrid },
    { name: "course", label: "Course", icon: BookOpen },
    { name: "assistant", label: "Assistant", icon: MessageSquare },
    { name: "profile", label: "Profile", icon: UserCircle },
  ];

  const bottomPadding =
    Platform.OS === "android" ? Math.max(insets.bottom, 15) : insets.bottom;

  return (
    <View
      className="flex-row bg-white border-t border-gray-100 shadow-lg"
      style={{
        paddingBottom: bottomPadding,
        paddingTop: 12,
        height: 65 + (insets.bottom > 0 ? insets.bottom : 10),
      }}
    >
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const tab = tabs.find((t) => t.name === route.name);

        if (!tab) return null;

        const Icon = tab.icon;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            onPress={onPress}
            onLongPress={onLongPress}
            className="flex-1 items-center justify-center"
          >
            <Icon size={24} color={isFocused ? "#db8300" : "#94A3B8"} />
            <Text
              className={`text-xs mt-1.5 font-semibold ${
                isFocused ? "" : "text-slate-400"
              }`}
              style={isFocused ? { color: "#db8300" } : {}}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
