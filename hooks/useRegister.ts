import { useMutation } from "@tanstack/react-query";
import { register } from "../api/auth";
import { RegisterFormData } from "../validation/authSchemas";

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterFormData) => register(data),
    onError: (error: any) => {
      console.error("useRegister mutation error:", error.message || error);
    },
  });
};
