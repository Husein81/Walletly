import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/hooks";
import { Account } from "@/types";
import Toast from "react-native-toast-message";
import { accountApi } from "@/api/account";

const useGetAccounts = (userId: string) => {
  return useQuery({
    queryKey: ["accounts"],
    queryFn: accountApi.getAccounts.bind(null, userId),
  });
};

const useCreateAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: accountApi.createAccount,
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
    mutationFn: accountApi.updateAccount,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
    onError: (error) => {
      console.error("Error updating account:", error);
    },
  });
};

const useDeleteAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (accountId: string) => accountApi.deleteAccount(accountId),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      Toast.show({
        type: "success",
        text1: "Account deleted successfully",
      });
    },
    onError: (error) => {
      console.error("Error deleting account:", error);
      Toast.show({
        type: "error",
        text1: "Error deleting account",
        text2: error.message,
      });
    },
  });
};

export { useGetAccounts, useCreateAccount, useUpdateAccount, useDeleteAccount };
