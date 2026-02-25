import { useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

// Local imports
import { api } from "@/hooks";
import { useAuthStore } from "@/store/authStore";
import { authApi } from "@/api/auth";
import { User } from "@/types";

const useLogin = () => {
  const queryClient = useQueryClient();
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setAuth(data);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error: Error) => {
      Toast.show({
        type: "error",
        text1: "Login failed",
        text2: error.message,
      });
    },
  });
};

const useRegister = () => {
  const queryClient = useQueryClient();
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      setAuth(data);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error: Error) => {
      Toast.show({
        type: "error",
        text1: "Registration failed",
        text2: error.message,
      });
    },
  });
};

const useCompleteRegistration = () => {
  const queryClient = useQueryClient();
  const { setAuth } = useAuthStore();
  return useMutation({
    mutationFn: authApi.completeRegistration,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error: Error) => {
      console.error("Error completing registration:", error.message);
      throw error;
    },
  });
};

const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();
  return useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: (data: User) => {
      setUser(data);
      queryClient.invalidateQueries({ queryKey: ["user"] });
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Profile updated successfully",
      });
    },
    onError: (error: Error) => {
      Toast.show({
        type: "error",
        text1: "Error updating profile",
        text2: error.message,
      });
      throw error;
    },
  });
};

export { useLogin, useRegister, useCompleteRegistration, useUpdateProfile };
