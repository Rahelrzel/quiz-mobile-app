import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { List, InputItem, Button, WhiteSpace } from "@ant-design/react-native";
import {
  GraduationCap,
  Mail,
  Lock,
  User,
  ArrowLeft,
} from "lucide-react-native";

const RegisterScreen = ({ navigation }: any) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    // Mock register logic
    navigation.navigate("Login");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="px-6 pt-16 pb-8"
      >
        <TouchableOpacity
          className="mb-6 w-10 h-10 items-center justify-center rounded-full bg-gray-100"
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={20} color="#374151" />
        </TouchableOpacity>

        <View className="mb-10">
          <Text className="text-3xl font-bold text-gray-900">
            Create Account
          </Text>
          <Text className="text-gray-500 mt-2">
            Start your learning journey with us
          </Text>
        </View>

        <View className="mb-8">
          <List style={{ borderRadius: 12, overflow: "hidden" }}>
            <InputItem
              placeholder="Full Name"
              value={name}
              onChange={(val) => setName(val)}
            >
              <User size={20} color="#6366F1" />
            </InputItem>
            <InputItem
              placeholder="Email"
              value={email}
              onChange={(val) => setEmail(val)}
              type="text"
            >
              <Mail size={20} color="#6366F1" />
            </InputItem>
            <InputItem
              placeholder="Password"
              value={password}
              onChange={(val) => setPassword(val)}
              type="password"
            >
              <Lock size={20} color="#6366F1" />
            </InputItem>
          </List>
        </View>

        <Button
          type="primary"
          onPress={handleRegister}
          style={{ borderRadius: 12, height: 50, backgroundColor: "#6366F1" }}
        >
          <Text className="text-white font-bold text-lg">Register</Text>
        </Button>

        <WhiteSpace size="xl" />

        <View className="flex-row justify-center mt-auto">
          <Text className="text-gray-600">Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text className="text-primary font-bold">Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
