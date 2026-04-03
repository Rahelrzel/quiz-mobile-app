import { usePaymentStatus as usePaymentContext } from "../src/context/PaymentContext";

/**
 * Hook for checking payment status.
 * This wraps the PaymentContext for use in quiz screens and components.
 * Returns { isPaid, loading, checkStatus } to match the requested interface.
 */
export const usePaymentStatus = () => {
  const {
    hasPaid: isPaid,
    isLoading: loading,
    checkPaymentStatus: checkStatus,
    setHasPaid,
  } = usePaymentContext();

  return { isPaid, loading, checkStatus, setHasPaid };
};
