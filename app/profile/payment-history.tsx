import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { getPaymentHistory, PaymentHistoryItem } from "@/services/userService";

const PRIMARY = "#db8300";

export default function PaymentHistoryScreen() {
  const router = useRouter();
  const [history, setHistory] = useState<PaymentHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await getPaymentHistory();
        setHistory(result);
      } catch {
        Alert.alert("Error", "Failed to load payment history.");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const openReceipt = async (url?: string | null) => {
    if (!url) {
      Alert.alert("Unavailable", "Receipt URL is not available.");
      return;
    }
    const canOpen = await Linking.canOpenURL(url);
    if (!canOpen) {
      Alert.alert("Unavailable", "Cannot open receipt URL.");
      return;
    }
    await Linking.openURL(url);
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color={PRIMARY} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center mb-6">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <Ionicons name="arrow-back" size={22} color="#111827" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-gray-900">Payment History</Text>
        </View>

        {history.length === 0 ? (
          <View className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
            <Text className="text-gray-600">
              No payment history found for this account.
            </Text>
          </View>
        ) : (
          history.map((item) => (
            <View
              key={item.id}
              className="bg-gray-50 border border-gray-100 rounded-2xl p-4 mb-4"
            >
              <Text className="text-gray-900 font-bold">
                {item.currency.toUpperCase()} {item.amount}
              </Text>
              <Text className="text-gray-500 text-sm mt-1">
                Status: {item.status}
              </Text>
              <Text className="text-gray-400 text-xs mt-1">
                Method: {item.paymentMethod || "N/A"}
              </Text>
              <Text className="text-gray-400 text-xs mt-1">
                Date: {new Date(item.createdAt).toLocaleDateString()}
              </Text>
              <TouchableOpacity
                className="mt-3 rounded-xl py-3 items-center"
                style={{ backgroundColor: PRIMARY }}
                onPress={() => openReceipt(item.receiptUrl)}
              >
                <Text className="text-white font-semibold">View Receipt</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
