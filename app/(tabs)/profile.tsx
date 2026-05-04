import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  UserCircle,
  Award,
  ChevronRight,
  Settings,
  ShieldCheck,
  LogOut,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { authStorage } from "@/lib/authStorage";
import {
  getPaymentStatus,
  getUserProfile,
  UserProfile,
} from "@/services/userService";
import {
  getUserCertificates,
  UserCertificate,
} from "@/services/certificateService";

const PRIMARY = "#db8300";

export default function ProfileScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [certificates, setCertificates] = useState<UserCertificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const initials = useMemo(() => {
    const fullName = profile?.name?.trim();
    if (!fullName) return "U";
    const parts = fullName.split(" ").filter(Boolean);
    return parts
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || "")
      .join("");
  }, [profile?.name]);

  const formattedJoinedDate = useMemo(() => {
    if (!profile?.createdAt) return "-";
    return new Date(profile.createdAt).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }, [profile?.createdAt]);

  const loadProfileData = useCallback(async () => {
    try {
      const [profileData, certificatesData, paymentData] = await Promise.all([
        getUserProfile(),
        getUserCertificates(),
        getPaymentStatus(),
      ]);

      setProfile({
        ...profileData,
        paid: paymentData.paid,
        paymentStatus: paymentData.paid ? "paid" : "unpaid",
      });
      setCertificates(certificatesData);
    } catch (error) {
      Alert.alert("Error", "Failed to load your profile data. Please try again.");
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      let mounted = true;

      const run = async () => {
        setIsLoading(true);
        await loadProfileData();
        if (mounted) {
          setIsLoading(false);
        }
      };

      run();
      return () => {
        mounted = false;
      };
    }, [loadProfileData]),
  );

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadProfileData();
    setIsRefreshing(false);
  }, [loadProfileData]);

  const handleLogout = async () => {
    await authStorage.clearAuth();
    router.replace("/login");
  };

  const handleOpenCertificate = (certificateId: string) => {
    router.push(`/certificate/${certificateId}`);
  };

  const handleEditProfile = () => {
    router.push("/profile/edit");
  };

  const handleChangePassword = () => {
    router.push("/profile/change-password");
  };

  const handlePaymentHistory = () => {
    router.push("/profile/payment-history");
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color={PRIMARY} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
      >
        <View className="px-6 pt-6">
          <View className="flex-row items-center mb-8">
            <UserCircle size={24} color={PRIMARY} />
            <Text className="text-2xl font-bold text-gray-900 ml-3">
              My Profile
            </Text>
          </View>

          <View className="bg-gray-50 border border-gray-100 rounded-2xl p-4 mb-8">
            <View className="flex-row items-center">
              <View
                className="w-14 h-14 rounded-full items-center justify-center"
                style={{ backgroundColor: PRIMARY }}
              >
                <Text className="text-white font-bold text-lg">{initials}</Text>
              </View>
              <View className="ml-4 flex-1">
                <Text className="text-gray-900 font-bold text-lg">
                  {profile?.name || "User"}
                </Text>
                <Text className="text-gray-500 text-sm">{profile?.email || "-"}</Text>
                <Text className="text-gray-400 text-xs mt-1">
                  {profile?.phone || "No phone"} | Joined {formattedJoinedDate}
                </Text>
              </View>
              <View
                className={`px-3 py-1 rounded-full ${
                  profile?.paid ? "bg-emerald-100" : "bg-gray-200"
                }`}
              >
                <Text
                  className={`text-xs font-bold ${
                    profile?.paid ? "text-emerald-700" : "text-gray-600"
                  }`}
                >
                  {profile?.paid ? "Paid" : "Free"}
                </Text>
              </View>
            </View>
          </View>

          {/* Stats Section */}
          <View className="flex-row gap-x-4 mb-10">
            <View
              className="flex-1 rounded-2xl p-6 items-center shadow-lg"
              style={{ backgroundColor: PRIMARY }}
            >
              <Text className="text-white font-bold text-3xl">
                {profile?.totalQuizzesCompleted ?? 0}
              </Text>
              <Text className="text-white/80 text-xs mt-1 font-semibold uppercase tracking-wider">
                Quizzes
              </Text>
            </View>
            <View className="flex-1 bg-gray-900 rounded-2xl p-6 items-center shadow-lg shadow-gray-200">
              <Text className="text-white font-bold text-3xl">
                {profile?.totalCertificatesEarned ?? certificates.length}
              </Text>
              <Text className="text-gray-400 text-xs mt-1 font-semibold uppercase tracking-wider">
                Certificates
              </Text>
            </View>
          </View>

          {/* Certificates Section */}
          <View className="mb-10">
            <View className="flex-row items-center mb-6">
              <Award size={20} color={PRIMARY} />
              <Text className="text-lg font-bold text-gray-900 ml-3">
                My Certificates
              </Text>
            </View>

            {certificates.map((cert) => (
              <TouchableOpacity
                key={cert.certificateId}
                className="flex-row items-center bg-gray-50 border border-gray-100 rounded-2xl p-4 mb-4"
                activeOpacity={0.7}
                onPress={() => handleOpenCertificate(cert.certificateId)}
              >
                <View className="bg-white rounded-xl p-2 mr-4 border border-gray-100 shadow-sm">
                  <ShieldCheck size={20} color={PRIMARY} />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-900 font-bold">{cert.title}</Text>
                  <Text className="text-gray-400 text-xs mt-0.5">
                    {new Date(cert.issueDate).toLocaleDateString()}
                  </Text>
                </View>
                <ChevronRight size={18} color="#94A3B8" />
              </TouchableOpacity>
            ))}

            {certificates.length === 0 && (
              <View className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
                <Text className="text-gray-500 text-sm">
                  You have not earned any certificates yet.
                </Text>
              </View>
            )}
          </View>

          {/* Settings Section */}
          <View className="mb-10">
            <TouchableOpacity
              className="flex-row items-center py-5 border-b border-gray-100"
              activeOpacity={0.6}
              onPress={handleEditProfile}
            >
              <Settings size={20} color="#94A3B8" />
              <Text className="text-gray-700 font-semibold ml-4 flex-1">
                Edit Profile
              </Text>
              <ChevronRight size={18} color="#94A3B8" />
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center py-5 border-b border-gray-100"
              activeOpacity={0.6}
              onPress={handleChangePassword}
            >
              <Settings size={20} color="#94A3B8" />
              <Text className="text-gray-700 font-semibold ml-4 flex-1">
                Change Password
              </Text>
              <ChevronRight size={18} color="#94A3B8" />
            </TouchableOpacity>

            {profile?.paid && (
              <TouchableOpacity
                className="flex-row items-center py-5 border-b border-gray-100"
                activeOpacity={0.6}
                onPress={handlePaymentHistory}
              >
                <Settings size={20} color="#94A3B8" />
                <Text className="text-gray-700 font-semibold ml-4 flex-1">
                  Payment History
                </Text>
                <ChevronRight size={18} color="#94A3B8" />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              className="flex-row items-center py-5"
              activeOpacity={0.6}
              onPress={handleLogout}
            >
              <LogOut size={20} color="#EF4444" />
              <Text className="text-red-500 font-semibold ml-4 flex-1">
                Sign Out
              </Text>
              <ChevronRight size={18} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
