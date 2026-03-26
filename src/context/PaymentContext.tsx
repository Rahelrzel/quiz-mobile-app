import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../../lib/axios";
import { useAuth } from "../../hooks/useAuth";

interface PaymentContextType {
  hasPaid: boolean;
  checkPaymentStatus: () => Promise<void>;
  setHasPaid: (status: boolean) => void;
  isLoading: boolean;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const PaymentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [hasPaid, setHasPaid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const checkPaymentStatus = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.get("/payments/status");
      // The backend returns { paid: boolean, quizSession: ... }
      setHasPaid(response.data.paid);
    } catch (error) {
      console.error("Failed to check payment status:", error);
      setHasPaid(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      checkPaymentStatus();
    } else {
      setHasPaid(false);
      setIsLoading(false);
    }
  }, [user]);

  return (
    <PaymentContext.Provider
      value={{ hasPaid, checkPaymentStatus, setHasPaid, isLoading }}
    >
      {children}
    </PaymentContext.Provider>
  );
};

export const usePaymentStatus = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error("usePaymentStatus must be used within PaymentProvider");
  }
  return context;
};
