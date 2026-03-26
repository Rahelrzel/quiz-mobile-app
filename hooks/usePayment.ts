import { useAuth } from "./useAuth";
import api from "../lib/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Linking from "expo-linking";

interface SavedQuizProgress {
  quizId: string;
  currentQuestionIndex: number;
  selectedAnswers: Record<string, number | null>;
  shuffledQuestionIds: string[];
  timestamp: number;
}

export const useGlobalPayment = () => {
  const { user } = useAuth();

  const initiatePayment = async (
    quizId: string,
    currentQuestionIndex: number,
    selectedAnswers: Record<string, number | null>,
    shuffledQuestionIds: string[],
    customSuccessUrl?: string,
    customCancelUrl?: string,
  ) => {
    try {
      // Generate success and cancel URLs for deep linking
      const successUrl =
        customSuccessUrl ||
        Linking.createURL("quiz/success", {
          queryParams: {
            quizId,
            session_id: "{CHECKOUT_SESSION_ID}",
          },
        });

      const cancelUrl =
        customCancelUrl ||
        Linking.createURL("quiz/cancel", {
          queryParams: {
            quizId,
          },
        });

      console.log("[useGlobalPayment] successUrl:", successUrl);
      console.log("[useGlobalPayment] cancelUrl:", cancelUrl);

      const response = await api.post("/payments/create-checkout-session", {
        quizId: Number(quizId),
        successUrl,
        cancelUrl,
      });

      return response.data.url;
    } catch (error) {
      console.error("Failed to initiate payment:", error);
      throw error;
    }
  };

  const verifyPayment = async (sessionId: string) => {
    try {
      // The web app uses /payments/status to check if paid.
      // We can also use /payments/verify-session if implemented, but /payments/status is fine for checking the flag.
      const response = await api.get("/payments/status");
      return response.data;
    } catch (error) {
      console.error("Failed to verify payment:", error);
      throw error;
    }
  };

  const getSavedQuizProgress = async (): Promise<SavedQuizProgress | null> => {
    try {
      const saved = await AsyncStorage.getItem("quiz_payment_progress");
      if (!saved) return null;

      const progress = JSON.parse(saved) as SavedQuizProgress;
      const THIRTY_MINUTES = 30 * 60 * 1000;

      if (Date.now() - progress.timestamp > THIRTY_MINUTES) {
        await AsyncStorage.removeItem("quiz_payment_progress");
        return null;
      }

      return progress;
    } catch {
      return null;
    }
  };

  const clearSavedQuizProgress = async () => {
    await AsyncStorage.removeItem("quiz_payment_progress");
  };

  return {
    initiatePayment,
    verifyPayment,
    getSavedQuizProgress,
    clearSavedQuizProgress,
  };
};
