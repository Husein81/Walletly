import { create } from "zustand";

import { User } from "../types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

interface AuthState {
  user: User | null;
  setAuth: (data: { user: User; token: string }) => void;
  clearAuth: () => void;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setAuth: async (data) => {
    try {
      if (data.token) {
        await AsyncStorage.setItem("authToken", data.token);
        await AsyncStorage.setItem("user", JSON.stringify(data.user));
        set({ user: data.user });
      }
    } catch (error) {
      throw error;
    }
  },

  clearAuth: async () => {
    await AsyncStorage.removeItem("authToken");
    await AsyncStorage.removeItem("user");
    set({ user: null });
    router.replace("/(auth)");
  },

  loadUser: async () => {
    const token = await AsyncStorage.getItem("authToken");

    if (token) {
      const userJson = await AsyncStorage.getItem("user");
      if (userJson) {
        set({ user: JSON.parse(userJson) });
      }
    }
  },
}));
