import { useQuery } from "@tanstack/react-query";
import { getPaymentPricing } from "../services/userService";

export const usePaymentPricing = () => {
  return useQuery({
    queryKey: ["payment-pricing"],
    queryFn: getPaymentPricing,
    staleTime: 1000 * 60 * 30,
  });
};
