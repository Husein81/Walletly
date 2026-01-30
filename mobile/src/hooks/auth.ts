import { useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

// Local imports
import { api } from "@/hooks";
import { useAuthStore } from "@/store/authStore";
import { authApi } from "@/api/auth";
import { User } from "@/types";

const useSendOtp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (phone: string) => authApi.sendOtp(phone),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error: Error) => {
      Toast.show({
        type: "error",
        text1: "Error sending OTP",
        text2: error.message,
      });
    },
  });
};

const useVerifyOtp = () => {
  const queryClient = useQueryClient();
  const { setAuth } = useAuthStore();
  return useMutation({
    mutationFn: ({ phone, code }: { phone: string; code: string }) =>
      authApi.verifyOtp({ phone, code }),
    onSuccess: (data) => {
      setAuth(data);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error: Error) => {
      Toast.show({
        type: "error",
        text1: "Error verifying OTP",
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

export { useSendOtp, useVerifyOtp, useCompleteRegistration, useUpdateProfile };
