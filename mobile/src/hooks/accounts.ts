import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/hooks";
import { Account } from "@/types";

const useGetAccounts = (userId: string) => {
  return useQuery({
    queryKey: ["accounts"],
    queryFn: async (): Promise<Account[]> => {
      const response = await api.get<Account[]>("/account", {
        params: {
          userId,
        },
      });
      return response.data;
    },
  });
};

const useCreateAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (account: Account): Promise<void> => {
      await api.post<Account>("/account", account);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
    onError: (error) => {
      console.error("Error creating account:", error);
    },
  });
};

const useUpdateAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (account: Account): Promise<void> => {
      await api.put<Account>(`/account/${account.id}`, account);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
    onError: (error) => {
      console.error("Error updating account:", error);
    },
  });
};

const useDeleteAccount = (accountId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (): Promise<void> => {
      await api.delete(`/account/${accountId}`);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
    onError: (error) => {
      console.error("Error deleting account:", error);
    },
  });
};

export { useGetAccounts, useCreateAccount, useUpdateAccount, useDeleteAccount };
