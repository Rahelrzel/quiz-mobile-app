import { useState, useEffect } from "react";
import { authStorage } from "@/lib/authStorage";

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const data = await authStorage.getUser();
      setUser(data);
      setIsLoading(false);
    };
    loadUser();
  }, []);

  return { user, isLoading };
};
