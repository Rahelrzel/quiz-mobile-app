import api from "@/lib/axios";

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  createdAt: string;
  totalQuizzesTaken: number;
  totalQuizzesCompleted: number;
  totalCertificatesEarned: number;
  paymentStatus: "paid" | "unpaid";
  paid: boolean;
}

export interface BasicUserProfile {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  createdAt: string;
}

export interface PaymentStatusResponse {
  paid: boolean;
  payment: {
    status: string;
    userId: number;
    paymentMethod?: string | null;
  } | null;
  quizSession?: unknown;
}

export interface UpdateProfilePayload {
  name: string;
  phone?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface PaymentHistoryItem {
  id: number;
  amount: number;
  currency: string;
  status: string;
  paymentMethod?: string | null;
  receiptUrl?: string | null;
  transactionId: string;
  createdAt: string;
  updatedAt: string;
}

export const getUserProfile = async (): Promise<UserProfile> => {
  const response = await api.get<UserProfile>("users/profile");
  return response.data;
};

export const getPaymentStatus = async (): Promise<PaymentStatusResponse> => {
  const response = await api.get<PaymentStatusResponse>("payments/status");
  return response.data;
};

export const updateUserProfile = async (
  payload: UpdateProfilePayload,
): Promise<{ message: string; user: BasicUserProfile }> => {
  const response = await api.put<{ message: string; user: BasicUserProfile }>(
    "users/profile",
    payload,
  );
  return response.data;
};

export const changeUserPassword = async (
  payload: ChangePasswordPayload,
): Promise<{ message: string }> => {
  const response = await api.put<{ message: string }>("users/password", payload);
  return response.data;
};

export const getPaymentHistory = async (): Promise<PaymentHistoryItem[]> => {
  const response = await api.get<PaymentHistoryItem[]>("users/payments");
  return response.data;
};
