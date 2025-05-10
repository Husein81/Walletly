import { useMutation, useQueryClient } from "@tanstack/react-query";

// Local imports
import { api } from "~/hooks";
import { useAuthStore } from "~/store/authStore";
import { User } from "~/types";

type LoginResponse = { user: User; token: string };

const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }): Promise<LoginResponse> => {
      const response = await api.post<LoginResponse>("/auth/login", {
        email,
        password,
      });
      return response.data;
    },
    onSuccess: (data) => {
      setAuth(data);
      queryClient.setQueryData(["user"], data);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

const useRegister = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      email,
      password,
    }: {
      name: string;
      email: string;
      password: string;
    }) => {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], data);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await api.post("/auth/logout");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

export { useLogin, useRegister, useLogout };
