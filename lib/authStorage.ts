import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

/**
 * Storage utility for handling authentication data securely
 */
export const authStorage = {
  /**
   * Save authentication token
   */
  async setToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    } catch (error) {
      console.error("Error saving token:", error);
    }
  },

  /**
   * Get authentication token
   */
  async getToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch (error) {
      console.error("Error getting token:", error);
      return null;
    }
  },

  /**
   * Remove authentication token
   */
  async removeToken(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    } catch (error) {
      console.error("Error deleting token:", error);
    }
  },

  /**
   * Save user data (as JSON string)
   */
  async setUser(user: any): Promise<void> {
    try {
      if (!user) return;

      // Extract only safe, serializable fields to avoid SecureStore errors
      const safeUser = {
        id: user.id || null,
        name: user.name || "",
        email: user.email || "",
        role: user.role || "user",
      };

      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(safeUser));
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  },

  /**
   * Get user data
   */
  async getUser(): Promise<any | null> {
    try {
      const user = await SecureStore.getItemAsync(USER_KEY);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error("Error getting user data:", error);
      return null;
    }
  },

  /**
   * Clear all auth data
   */
  async clearAuth(): Promise<void> {
    try {
      await Promise.all([
        SecureStore.deleteItemAsync(TOKEN_KEY),
        SecureStore.deleteItemAsync(USER_KEY),
      ]);
    } catch (error) {
      console.error("Error clearing auth data:", error);
    }
  },
};
