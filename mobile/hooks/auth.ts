import { useMutation, useQueryClient } from "@tanstack/react-query";

// Local imports
import { api } from "~/hooks";
import { useAuthStore } from "~/store/authStore";
import { User } from "~/types";

type LoginResponse = { user: User; token: string };

const useLogin = (email: string, password: string) => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (): Promise<LoginResponse> => {
      const response = await api.post<LoginResponse>("/auth/login", {
        email,
        password,
      });
      return response.data;
    },
    onSuccess: (data) => {
      setAuth(data);
      queryClient.setQueryData(["user"], data);
    },
  });
};

const useRegister = (name: string, email: string, password: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], data);
    },
  });
};

const useLogout = () => {
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  return useMutation({
    mutationFn: async () => {
      await api.post("/auth/logout");
    },
    onSuccess: () => {
      clearAuth();
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

export { useLogin, useRegister, useLogout };
