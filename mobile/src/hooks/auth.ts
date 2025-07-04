import { useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

// Local imports
import { api } from "~/hooks";
import { useAuthStore } from "~/store/authStore";

const useSendOtp = () => {
  const queryClient = useQueryClient();
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: async (phone: string) => {
      const response = await api.post("/auth/send-otp", {
        phone,
      });
      return response.data.code;
    },
    onSuccess: (data) => {
      setAuth(data);
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
    mutationFn: async ({ phone, code }: { phone: string; code: string }) => {
      const response = await api.post("/auth/verify-otp", {
        phone,
        code,
      });
      return response.data;
    },
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
    mutationFn: async ({
      userId,
      name,
      email,
    }: {
      userId: string;
      name: string;
      email: string;
    }) => {
      const response = await api.put(`/auth/complete-registration/${userId}`, {
        name,
        email,
      });
      return response.data;
    },
    onSuccess: (data) => {
      setAuth(data);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error: Error) => {
      console.error("Error completing registration:", error.message);
      throw error;
    },
  });
};

export { useSendOtp, useVerifyOtp, useCompleteRegistration };
