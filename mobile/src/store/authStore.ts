// Global imports
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { create } from "zustand";

// Local imports
import { User } from "../types";
import { authApi } from "@/api/auth";

interface DecodedToken {
  exp: number; // UNIX timestamp
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isReady: boolean;
  setAuth: (data: { user: User; token: string }) => Promise<void>;
  setUser: (user: User) => Promise<void>;
  clearAuth: () => Promise<void>;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isReady: false,
  setIsReady: (isReady: boolean) => set({ isReady }),
  setAuth: async (data) => {
    try {
      if (data.token) {
        await AsyncStorage.setItem("authToken", data.token);
        await AsyncStorage.setItem("authUser", JSON.stringify(data.user));
        set({ user: data.user, token: data.token });
      }
    } catch (error) {
      throw error;
    }
  },

  setUser: async (user) => {
    try {
      await AsyncStorage.setItem("authUser", JSON.stringify(user));
      set({ user });
    } catch (error) {
      throw error;
    }
  },

  clearAuth: async () => {
    const token = await AsyncStorage.getItem("authToken");
    if (token) {
      await authApi.logout(token);
    }
    await AsyncStorage.removeItem("authToken");
    await AsyncStorage.removeItem("authUser");
    set({ user: null, token: null });
    router.replace("/auth");
  },

  loadUser: async () => {
    const token = await AsyncStorage.getItem("authToken");
    try {
      if (token) {
        // For UUID-based tokens (local sessions), just check if they exist
        // In a production app with JWT tokens, you'd decode and check expiry
        const userJson = await AsyncStorage.getItem("authUser");
        if (userJson) {
          set({ user: JSON.parse(userJson), token });
        }
      }
      set({ isReady: true });
    } catch (err) {
      // Error loading auth data
      await AsyncStorage.removeItem("authToken");
      await AsyncStorage.removeItem("authUser");
      set({ user: null, token: null, isReady: true });
      router.replace("/auth");
    }
  },
}));
