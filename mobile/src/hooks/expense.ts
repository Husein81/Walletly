import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { expenseApi } from "@/api/expense";

const useGetExpenses = (
  userId: string,
  params: {
    year?: string;
    month?: string;
    startDate?: Date;
    endDate?: Date;
    searchTerm?: string;
  },
) => {
  return useQuery({
    queryKey: ["expenses", userId, params],
    queryFn: () => expenseApi.getExpenses({ userId, ...params }),
  });
};

const useCreateExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: expenseApi.createExpense,
    onSuccess: () => {
      // Invalidate the expenses query to refetch the data
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });
};

const useUpdateExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: expenseApi.updateExpense,
    onSuccess: () => {
      // Invalidate the expenses query to refetch the data
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });
};

const useGetExpenseById = (expenseId: string) => {
  return useQuery({
    queryKey: ["expense", expenseId],
    queryFn: () => expenseApi.getExpenseById(expenseId),
  });
};

const useDeleteExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: expenseApi.deleteExpense,
    onSuccess: () => {
      // Invalidate the expenses query to refetch the data
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
};

export {
  useGetExpenses,
  useCreateExpense,
  useUpdateExpense,
  useGetExpenseById,
  useDeleteExpense,
};
