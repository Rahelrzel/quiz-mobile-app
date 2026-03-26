import { useMutation } from "@tanstack/react-query";
import { login } from "../api/auth";
import { LoginFormData } from "../validation/authSchemas";

export const useLogin = () => {
  return useMutation({
    mutationFn: (data: LoginFormData) => {
      console.log("useLogin mutationFn triggered with data:", data);
      return login(data);
    },
    onMutate: (variables) => {
      console.log("useLogin onMutate with variables:", variables);
    },
    onError: (error: any) => {
      console.error("useLogin mutation error:", error.message || error);
    },
    onSuccess: (data) => {
      console.log("useLogin mutation success:", data);
    },
  });
};
