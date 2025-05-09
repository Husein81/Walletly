// Global imports
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { jwtDecode } from "jwt-decode";
import { create } from "zustand";

// Local imports
import { User } from "../types";

interface DecodedToken {
  exp: number; // UNIX timestamp
}

interface AuthStore {
  user: User | null;
  token: string | null;
  setAuth: (data: { user: User; token: string }) => Promise<void>;
  clearAuth: () => Promise<void>;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,

  setAuth: async (data) => {
    try {
      if (data.token) {
        await AsyncStorage.setItem("authToken", data.token);
        await AsyncStorage.setItem("user", JSON.stringify(data.user));
        set({ user: data.user, token: data.token });
      }
    } catch (error) {
      throw error;
    }
  },

  clearAuth: async () => {
    await AsyncStorage.removeItem("authToken");
    await AsyncStorage.removeItem("user");
    set({ user: null, token: null });
    router.replace("/auth"); // Redirect to login or home
  },

  loadUser: async () => {
    const token = await AsyncStorage.getItem("authToken");

    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        const now = Date.now() / 1000;

        if (decoded.exp && decoded.exp < now) {
          // Token expired
          await AsyncStorage.removeItem("authToken");
          await AsyncStorage.removeItem("user");
          set({ user: null, token: null });
          router.replace("/auth"); // redirect to login
          return;
        }

        const userJson = await AsyncStorage.getItem("user");
        if (userJson) {
          set({ user: JSON.parse(userJson), token });
        }
      } catch (err) {
        // Malformed token
        await AsyncStorage.removeItem("authToken");
        await AsyncStorage.removeItem("user");
        set({ user: null, token: null });
        router.replace("/auth");
      }
    }
  },
}));
