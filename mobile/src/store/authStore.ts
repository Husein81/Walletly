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
    await AsyncStorage.removeItem("authToken");
    await AsyncStorage.removeItem("authUser");
    set({ user: null, token: null });
    router.replace("/auth");
  },

  loadUser: async () => {
    const token = await AsyncStorage.getItem("authToken");
    try {
      if (token) {
        const decoded = jwtDecode<DecodedToken>(token);
        const now = Date.now() / 1000;

        if (decoded.exp && decoded.exp < now) {
          // Token expired
          await AsyncStorage.removeItem("authToken");
          await AsyncStorage.removeItem("authUser");
          set({ user: null, token: null });
          router.replace("/auth"); // redirect to login
          return;
        }

        const userJson = await AsyncStorage.getItem("authUser");
        if (userJson) {
          set({ user: JSON.parse(userJson), token });
        }
      }
      set({ isReady: true });
    } catch (err) {
      // Malformed token
      await AsyncStorage.removeItem("authToken");
      await AsyncStorage.removeItem("authUser");
      set({ user: null, token: null });
      router.replace("/auth");
    }
  },
}));
