import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useCertificate } from "@/hooks/useQuizzes";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

const PRIMARY = "#db8300";
const PRIMARY_LIGHT = "#fff8eb";

export default function CertificateScreen() {
  const { certificateId } = useLocalSearchParams<{ certificateId: string }>();
  const router = useRouter();
  const { data: cert, isLoading, isError } = useCertificate(certificateId);

  const handleDownload = async () => {
    if (!cert) return;

    const html = `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
          <style>
            body { 
              font-family: 'Helvetica', 'Arial', sans-serif; 
              display: flex; 
              justify-content: center; 
              align-items: center; 
              height: 100vh; 
              margin: 0;
              background-color: #fff8eb;
            }
            .certificate-container {
              background-color: #ffffff;
              border: 10px solid #db8300;
              padding: 50px;
              width: 80%;
              text-align: center;
              box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            }
            .title { color: #db8300; font-size: 48px; font-weight: bold; margin-bottom: 20px; }
            .content { font-size: 24px; color: #4b5563; margin-bottom: 30px; }
            .user-name { font-size: 36px; color: #111827; font-weight: bold; text-decoration: underline; margin: 20px 0; }
            .quiz-title { font-size: 28px; color: #db8300; font-weight: bold; margin: 10px 0; }
            .details { font-size: 18px; color: #9ca3af; margin-top: 40px; }
          </style>
        </head>
        <body>
          <div class="certificate-container">
            <div class="title">CERTIFICATE</div>
            <div class="content">This certifies that</div>
            <div class="user-name">${cert.user.name}</div>
            <div class="content">successfully passed</div>
            <div class="quiz-title">${cert.quiz.title} Quiz</div>
            <div class="details">
              Score: ${cert.score}% | Category: ${cert.category.name}<br/>
              Date: ${cert.issueDate}<br/>
              Certificate ID: ${cert.certificateID}
            </div>
          </div>
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri, {
        UTI: ".pdf",
        mimeType: "application/pdf",
      });
    } catch (error) {
      Alert.alert("Error", "Failed to generate PDF. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color={PRIMARY} />
      </SafeAreaView>
    );
  }

  if (isError || !cert) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center p-6">
        <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
        <Text className="text-xl font-bold mt-4">Certificate Not Found</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-6 px-8 py-3 rounded-xl"
          style={{ backgroundColor: PRIMARY }}
        >
          <Text className="text-white font-bold">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: PRIMARY_LIGHT }}
      edges={["top", "bottom"]}
    >
      <Stack.Screen
        options={{
          title: "Your Certificate",
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} className="ml-4">
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView className="flex-1 p-6">
        <View
          className="bg-white p-8 rounded-3xl shadow-xl items-center text-center border-4"
          style={{ borderColor: PRIMARY }}
        >
          <Text className="text-4xl font-black mb-6" style={{ color: PRIMARY }}>
            CERTIFICATE
          </Text>
          <View className="w-16 h-px bg-gray-200 mb-6" />

          <Text className="text-gray-400 font-bold uppercase text-xs tracking-widest mb-2">
            This certifies that
          </Text>
          <Text className="text-3xl font-black text-gray-900 mb-6 underline">
            {cert.user.name}
          </Text>

          <Text className="text-gray-400 font-bold uppercase text-xs tracking-widest mb-2">
            successfully passed
          </Text>
          <Text className="text-xl font-bold mb-2" style={{ color: PRIMARY }}>
            {cert.quiz.title} Quiz
          </Text>
          <View
            className="px-3 py-1 rounded-full mb-8"
            style={{ backgroundColor: PRIMARY_LIGHT }}
          >
            <Text className="font-bold text-xs" style={{ color: PRIMARY }}>
              {cert.category.name}
            </Text>
          </View>

          <View className="w-full border-t border-gray-100 pt-8 mt-4">
            <View className="flex-row justify-between mb-4">
              <View>
                <Text className="text-gray-400 text-[10px] font-bold uppercase">
                  Score
                </Text>
                <Text className="text-gray-900 font-bold">{cert.score}%</Text>
              </View>
              <View className="items-end">
                <Text className="text-gray-400 text-[10px] font-bold uppercase">
                  Date
                </Text>
                <Text className="text-gray-900 font-bold">
                  {cert.issueDate}
                </Text>
              </View>
            </View>
            <View>
              <Text className="text-gray-400 text-[10px] font-bold uppercase">
                Certificate ID
              </Text>
              <Text className="text-gray-500 text-xs font-mono">
                {cert.certificateID}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleDownload}
          className="mt-10 rounded-2xl py-5 items-center flex-row justify-center shadow-lg"
          style={{ backgroundColor: PRIMARY }}
        >
          <Ionicons name="download-outline" size={24} color="white" />
          <Text className="text-white font-bold text-lg ml-3">
            Download Certificate
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.replace("/home")}
          className="mt-4 rounded-2xl py-5 items-center border-2 bg-white"
          style={{ borderColor: PRIMARY }}
        >
          <Text className="font-bold text-lg" style={{ color: PRIMARY }}>
            Back to Home
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
