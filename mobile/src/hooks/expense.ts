import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from ".";
import { Expense } from "@/types";

const useGetExpenses = (
  userId: string,
  params: { year?: string; month?: string; searchTerm?: string }
) => {
  return useQuery({
    queryKey: ["expenses"],
    queryFn: async (): Promise<Expense[]> => {
      const response = await api.get("/expense", {
        params: {
          userId,
          ...params,
        },
      });
      return response.data;
    },
  });
};

const useCreateExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Expense) => {
      const response = await api.post("/expense", data);
      return response.data;
    },
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
    mutationFn: async (data: Expense) => {
      const response = await api.put(`/expense/${data.id}`, data);
      return response.data;
    },
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
    queryFn: async (): Promise<Expense> => {
      const response = await api.get<Expense>(`/expense/${expenseId}`);
      return response.data;
    },
  });
};

const useDeleteExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (expenseId: string) => {
      await api.delete(`/expense/${expenseId}`);
    },
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
