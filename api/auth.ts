import api from "../lib/axios";
import { LoginFormData, RegisterFormData } from "../validation/authSchemas";

export interface AuthResponse {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
  token: string;
}

export const login = async (data: LoginFormData): Promise<AuthResponse> => {
  console.log("api/auth: login called with:", data);
  const response = await api.post<AuthResponse>("auth/login", data);
  console.log("api/auth: login response received:", response.status);
  return response.data;
};

export const register = async (
  data: RegisterFormData,
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("auth/register", data);
  return response.data;
};
